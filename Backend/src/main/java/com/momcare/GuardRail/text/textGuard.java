package com.momcare.GuardRail.text;

import ai.onnxruntime.*;
import java.util.*;
// Add HuggingFace Tokenizers Java import
import ai.djl.huggingface.tokenizers.HuggingFaceTokenizer;

public class textGuard {
    public static void main(String[] args) throws Exception {
        OrtEnvironment env = OrtEnvironment.getEnvironment();
        OrtSession.SessionOptions sessOpt = new OrtSession.SessionOptions();

        // Load DistilBERT tokenizer using DJL's HuggingFaceTokenizer
        HuggingFaceTokenizer tokenizer = HuggingFaceTokenizer.newInstance("distilbert-base-uncased");

        // Example input text to classify
        String text = "Sex Technology ";
        

        // Tokenize input text
        ai.djl.huggingface.tokenizers.Encoding encode = tokenizer.encode(text);
        long[] inputIdsArr = encode.getIds();
        long[] attentionMaskArr = encode.getAttentionMask();

        // Prepare input tensors for ONNX model
        long[][] inputIds = new long[1][inputIdsArr.length];
        long[][] attentionMask = new long[1][attentionMaskArr.length];
        inputIds[0] = inputIdsArr;
        attentionMask[0] = attentionMaskArr;

        Map<String, OnnxTensor> modelInputs = new HashMap<>();
        modelInputs.put("input_ids", OnnxTensor.createTensor(env, inputIds));
        modelInputs.put("attention_mask", OnnxTensor.createTensor(env, attentionMask));

        try (OrtSession model = env.createSession("src\\main\\java\\com\\momcare\\GuardRail\\text\\distilbert_nsfw_model.onnx", sessOpt)) {
            OrtSession.Result modelResult = model.run(modelInputs);

            OnnxValue outputValue = modelResult.get(0);
            float[][] result = (float[][]) outputValue.getValue();

            double[] logits = new double[result[0].length];
            for (int i = 0; i < result[0].length; i++) {
                logits[i] = result[0][i];
            }
            double[] probs = softmax(logits);
            int predicted = 0;
            for (int i = 1; i < probs.length; i++) {
                if (probs[i] > probs[predicted]) predicted = i;
            }
            List<String> classNames = java.util.Arrays.asList("safe", "nsfw");
         
            // Output as JSON-like structure
            List<Map<String, Object>> output = new ArrayList<>();
            for (int i = 0; i < probs.length; i++) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("className", classNames.get(i));
                entry.put("probability", Math.round(probs[i] * 100000.0) / 100000.0);
                output.add(entry);
            }
            System.out.println(output);

            modelResult.close();
        }
    }

    // Softmax utility
    private static double[] softmax(double[] logits) {
        double max = Arrays.stream(logits).max().orElse(0.0);
        double sum = 0.0;
        double[] exps = new double[logits.length];
        for (int i = 0; i < logits.length; i++) {
            exps[i] = Math.exp(logits[i] - max);
            sum += exps[i];
        }
        for (int i = 0; i < exps.length; i++) {
            exps[i] /= sum;
        }
        return exps;
    }
}
