import React from "react";
import { useParams } from "react-router-dom";
import CategoriaForm from "./CategoriaForm";

const CategoriaEditar = () => {
  const { id } = useParams();
  return <CategoriaForm key={id} modo="editar" />;
};

export default CategoriaEditar;
