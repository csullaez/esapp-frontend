import { Route, Routes } from "react-router-dom";
import IngresoCliente from "./pages/IngresoCliente";
import Facturas from "./pages/Facturas";
import FacturasAdmin from "./pages/FacturasAdmin";
import "./App.css";

function App() {
  return (
    <div className="layout">
      <Routes>
        <Route path="/" element={<IngresoCliente />} />
        <Route path="/facturas/:idCliente?" element={<Facturas />} />
        <Route path="/facturasAdmin" element={<FacturasAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
