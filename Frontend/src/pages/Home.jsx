import React from "react";
import HomePosts from "../components/HomePosts";
import Layout from "../components/Layout";

function Home() {
  return (
    <Layout>
  <div className="px-4 sm:px-10 lg:px-24 xl:px-48 py-12 bg-gradient-to-b from-purple-50 to-white min-h-[80vh]">
    <HomePosts />
  </div>
</Layout>
 
  );
}

export default Home;
