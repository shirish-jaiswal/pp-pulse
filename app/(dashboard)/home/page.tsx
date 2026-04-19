import axios from "axios";

async function HomePage() {
  const res = await axios.get("https://pp-pulse-backend.onrender.com/api/auth/test");

  console.log("res :: ", res);

  return (
    <div>
      <pre>{JSON.stringify(res.data, null, 2)}</pre>
    </div>
  );
}

export default HomePage;