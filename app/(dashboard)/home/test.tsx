const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default async function TestPage() {
  await delay(5000); 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Data Loaded!</h1>
      <p>This content appeared after a 5-second delay.</p>
    </div>
  );
}