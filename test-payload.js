async function test() {
  const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='.repeat(10000); // approx 800kb
  try {
    const res = await fetch('http://localhost:10000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        farmerId: '1',
        message: 'test',
        mediaAttached: true,
        mediaData: dummyBase64
      })
    });
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', await res.text());
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}
test();
