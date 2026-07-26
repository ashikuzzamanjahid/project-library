export async function GET() {
  return new Response(
    "This legacy media reference does not contain the original image. Upload the screenshot again from the admin editor.",
    {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-content-type-options": "nosniff",
      },
    },
  );
}
