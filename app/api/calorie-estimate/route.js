import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create form data for Python service
    const pythonFormData = new FormData();
    pythonFormData.append('file', file);

    // Call Python service directly
    const response = await fetch('http://127.0.0.1:8001/api/calorie-estimate', {
      method: 'POST',
      body: pythonFormData,
    });

    if (!response.ok) {
      throw new Error(`Python service error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in calorie estimate API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    );
  }
} 