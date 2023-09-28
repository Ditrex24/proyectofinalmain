import "./login.css";
import { Formik } from "formik";
import React from "react";

export default function Login() {
  let regExPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/;
  let regExEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return (
    <>
      <Formik
        // Declaramos los valores iniciales
        initialValues={{
          email: "",
          password: "",
        }}
        // Funcion para validar email y passwords
        validate={(valores) => {
          let errores = {};

          // Validamos el email y ademas testeamos con una expresion regular para que el email escrito sea formato correcto de email
          if (!valores.email) {
            errores.email = "Please, put an email";
          } else if (regExEmail.test(valores.email)) {
            errores.email = "El email debe ser correcto";
          }
          return errores;
        }}
        onSubmit={(valores) => {
          console.log(valores);
          console.log("Formulario enviado");
        }}
      >
        {({ values, errors, handleSubmit, handleChange, handleBlur }) => (
          <form className="formulario" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <hr />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Put your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <hr />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Put your password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>
            <button type="submit">Send</button>
          </form>
        )}
      </Formik>
    </>
  );
}
