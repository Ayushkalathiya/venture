// call /api/gemini
export async function gemin(promt: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: promt }),
    });

    console.log(res);
    

    if (res.ok) {
      return res.json();
    }


  } catch (error) {
    console.error("Error during Google Sign-In:", error);
  }
}
