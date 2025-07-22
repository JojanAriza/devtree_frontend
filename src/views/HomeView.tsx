import Header from "../components/Header";
import Searchform from "../components/Searchform";

export default function HomeView() {
  return (
    <>
        <Header/>

        <main className="bg-gray-100 py-10 min-h-screen lg:bg-home bg-no-repeat bg-right-top lg:bg-home-xl">
            <div className="max-w-5xl mx-auto mt-10">
                <div className="lg:w-1/2 px-10 lg:p-0 space-y-6">
                    <h1 className="text-6xl font-black">Todas Tus <span className="text-cyan-400">Redes Sociales</span> en un enlace</h1>
                    <p className="text-slate-800 text-xl">Únete a más de 200 mil developers compartiendo sus redes sociales, comparte tu perfil de Tiktok, Facebook, Instagram, YouTube, Github y más</p>

                    <Searchform/>
                </div>
            </div>
        </main>
    </>
  )
}