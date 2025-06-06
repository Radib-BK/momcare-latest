package com.momcare.GuardRail.image;

import ai.djl.Model;
import ai.djl.inference.Predictor;
import ai.djl.modality.Classifications;
import ai.djl.modality.cv.Image;
import ai.djl.modality.cv.ImageFactory;
import ai.djl.modality.cv.transform.*;
import ai.djl.modality.cv.translator.ImageClassificationTranslator;
import ai.djl.translate.TranslateException;
import ai.djl.MalformedModelException;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

public class imageGuard {

    // Method to test an image with a .pt model using DJL and ImageClassificationTranslator
    public static void testImage(String modelDir, String imagePath, List<String> classNames) throws IOException, TranslateException, MalformedModelException {
        try (Model model = Model.newInstance("98_mobilenetv3_nsfw")) {
            model.load(Paths.get(modelDir));

            Image img = ImageFactory.getInstance().fromFile(Paths.get(imagePath));

            ImageClassificationTranslator translator = ImageClassificationTranslator.builder()
                .addTransform(new Resize(256))
                .addTransform(new CenterCrop(224, 224))
                .addTransform(new ToTensor())
                .optApplySoftmax(true)
                .optSynset(classNames)
                .build();

            try (Predictor<Image, Classifications> predictor = model.newPredictor(translator)) {
                Classifications result = predictor.predict(img);
                System.out.println(result);
            }
        }
    }

    public static void main(String[] args) throws Exception {
        // Example usage:
        String modelDir = "src\\main\\java\\com\\momcare\\GuardRail\\image"; // directory containing your .pt file
        String imagePath = "src\\main\\java\\com\\momcare\\GuardRail\\image\\33.jpg"; // path to your test image

        // Define class names manually
        List<String> classNames = java.util.Arrays.asList("SAFE", "NSFW");

        testImage(modelDir, imagePath, classNames);
    }
}
