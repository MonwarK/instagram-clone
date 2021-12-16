import { getProviders, signIn } from "next-auth/react";
import Header from "../../components/Header";

export default function signin({ providers }) {
  return (
    <>
      <Header />
      <main className="bg-gray-100 h-screen grid place-items-center">
        <div className="max-w-md mx-auto text-center text-lg font-medium">
          <img className="w-full max-w-[200px] mx-auto" src="https://links.papareact.com/ocw" alt="" />
          <h2>This is not the real Instagram application, this is a personal project made to help improve my coding skills.</h2>    
        </div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button className="bg-blue-500 p-3 rounded-lg text-white" onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </main>
      
    </>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers
    }
  }
}