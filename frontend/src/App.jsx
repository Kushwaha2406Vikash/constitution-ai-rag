import React, { useState } from "react";
import Header from "./component/Header.jsx";
import ConstitutionQuery from "./component/ConstitutionQuery.jsx";
import HelpSection from "./component/HelpSection.jsx";
import Footer from "./component/Footer.jsx";

const App = () => {
  const [response, setResponse] = useState(null); // state to store API response

  return (
    <div className="flex flex-col min-h-screen w-full text-slate-800 bg-cover bg-center bg-no-repeat bg-[#99ddff]" 
     style={{ backgroundImage: "url('/5931481.jpg')" }}
    
    >
      {/* Header Section */}
      <section className="flex-shrink-0">
        <Header />
      </section>

      {/* Query Section */}
      <section className="flex-shrink-0">
        {/* Pass setResponse to ConstitutionQuery */}
        <ConstitutionQuery setResponse={setResponse} />
      </section>

      
      {/* Help Section */}
      <section className="flex-shrink-0">
        <HelpSection />
      </section>

      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default App;
