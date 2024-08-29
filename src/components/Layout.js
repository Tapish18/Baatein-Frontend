import Header from "./Header";
import Footer from "./Footer";
// import usePreviousLocation from "../hooks/usePreviousLocation";

const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen height-auto grid
     grid-cols-1 grid-rows-[75px_1fr_80px] relative"
    >
      <div className="absolute top-0 left-0 w-full h-3/4 bg-gradient-to-b from-[#e7717d] z-0"></div>
      {/* <div className="absolute bottom-0 left-0 w-full h-1/4  from-[#57a9e7] z-10"></div> */}
      <Header />
      <main className="relative z-10 px-10 ">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
