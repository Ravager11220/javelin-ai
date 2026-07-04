import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const CITY = 'Dharwad'; // Change this to your city

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch weather' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server Error' },
      { status: 500 }
    );
  }
}
