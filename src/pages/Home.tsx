import { useNavigate } from "react-router-dom";
import homBackground from "../assets/background.webp";
import { CardArticle } from "../components/CardArticle";
import { Searchbar } from "../components/Searchbar/Searchbar";

export const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query && query.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <main>
      <section className="min-h-[480px] text-center flex flex-col justify-center items-center relative py-16 px-4 overflow-hidden">
        <img
          src={homBackground}
          alt="DevJobs Hero Background"
          className="absolute w-full h-full object-cover z-0 inset-0 [mask-image:linear-gradient(to_bottom,rgba(16,25,34,0.95)_5%,rgba(16,25,34,0.4)_50%,rgba(16,25,34,0)_90%)]"
        />
        <div className="relative z-10 max-w-3xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-3 text-balance">
            Encuentra el trabajo de tus sueños
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 text-balance">
            Únete a la comunidad más grande de desarrolladores y encuentra tu
            próxima oportunidad.
          </p>
          <form
            role="search"
            className="max-w-2xl w-full mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <Searchbar
              placeholder="Buscar empleos por título, habilidad o empresa"
              onSearch={handleSearch}
            />
          </form>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#06182a]">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              ¿Por qué DevJobs?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              DevJobs es la principal plataforma de búsqueda de empleo para
              desarrolladores. Conectamos a los mejores talentos con las
              empresas más innovadoras.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardArticle>
              <CardArticle.Image>
                <svg
                  fill="currentColor"
                  height="32"
                  viewBox="0 0 256 256"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z" />
                </svg>
              </CardArticle.Image>
              <CardArticle.Title title="Encuentra el trabajo de tus sueños" />
              <CardArticle.Description description="Busca miles de empleos de las mejores empresas de todo el mundo." />
            </CardArticle>

            <CardArticle>
              <CardArticle.Image>
                <svg
                  fill="currentColor"
                  height="32"
                  viewBox="0 0 256 256"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
                </svg>
              </CardArticle.Image>
              <CardArticle.Title title="Conecta con las mejores empresas" />
              <CardArticle.Description description="Conecta con empresas que están contratando por tus habilidades" />
            </CardArticle>

            <CardArticle>
              <CardArticle.Image>
                <svg
                  fill="currentColor"
                  height="32"
                  viewBox="0 0 256 256"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z" />
                </svg>
              </CardArticle.Image>
              <CardArticle.Title title="Obtén el salario que mereces" />
              <CardArticle.Description description="Obtén el salario que mereces con nuestra calculadora de salarios." />
            </CardArticle>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
