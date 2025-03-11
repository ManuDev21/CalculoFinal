$(document).ready(function () {
    let grafica;

    $("#calcular").click(function () {
        let expresion = $("#funcion").val();
        let tipo = $("#tipoCalculo").val();
        let valor = parseFloat($("#valor").val());

        if (!expresion.trim()) {
            Swal.fire("Error", "Por favor ingresa una función válida.", "error");
            return;
        }

        try {
            let resultado, mensaje;
            let f = math.compile(expresion);
            let x_vals = math.range(-10, 10, 0.1).toArray();
            let y_vals = x_vals.map(x => f.evaluate({ x }));

            switch (tipo) {
                case "funcion":
                    let resultadoFuncion = f.evaluate({ x: valor });
                    let dominio = "Todos los números reales";
                    let rangoMin = Math.min(...y_vals);
                    let rangoMax = Math.max(...y_vals);
                    let rango = `[${rangoMin}, ${rangoMax}]`;
                    mensaje = `El valor de f(${valor}) es: ${resultadoFuncion} <br> Dominio: ${dominio} <br> Rango: ${rango}`;
                    break;


                case "derivada":
                    let primeraDerivada = math.derivative(expresion, "x").toString();
                    let segundaDerivada = math.derivative(primeraDerivada, "x").toString();
                    let derivadaEval = math.compile(primeraDerivada);
                    let derivada_y_vals = x_vals.map(x => derivadaEval.evaluate({ x }));
                    let rangoMinD = Math.min(...derivada_y_vals);
                    let rangoMaxD = Math.max(...derivada_y_vals);
                    let rangoDerivada = `[${rangoMinD}, ${rangoMaxD}]`;

                    let limiteSuperior = math.compile(primeraDerivada).evaluate({ x: 1.0001 });
                    let limiteInferior = math.compile(primeraDerivada).evaluate({ x: 0.9999 });

                    mensaje = `Primera derivada: ${primeraDerivada} <br> Segunda derivada: ${segundaDerivada} <br>
                    Dominio: Todos los números reales <br> Rango: ${rangoDerivada} <br>
                    Límite Superior: ${limiteSuperior} <br> Límite Inferior: ${limiteInferior}`;
                    break;

                case "limite":
                    if (isNaN(valor)) {
                        Swal.fire("Error", "Debes ingresar un valor para evaluar el límite.", "error");
                        return;
                    }

                    let limite = f.evaluate({ x: valor });
                    let limiteSuperiorL = f.evaluate({ x: valor + 0.0001 });
                    let limiteInferiorL = f.evaluate({ x: valor - 0.0001 });

                    let limitesIzq = [];
                    let limitesDer = [];
                    for (let i = 1; i <= 5; i++) {
                        limitesIzq.push(f.evaluate({ x: valor - i * 0.1 }));
                        limitesDer.push(f.evaluate({ x: valor + i * 0.1 }));
                    }

                    mensaje = `Resultado del límite: ${limite} <br>
                    Dominio: Todos los números reales <br> Rango: Depende de la función <br>
                    Límite Superior: ${limiteSuperiorL} <br> Límite Inferior: ${limiteInferiorL} <br>
                    Límites laterales izquierda: ${limitesIzq.join(", ")} <br>
                    Límites laterales derecha: ${limitesDer.join(", ")}`;
                    break;

                default:
                    mensaje = "Cálculo no válido.";
            }

            Swal.fire({
                title: "Resultado",
                html: mensaje,
                icon: "success"
            });

            // Graficar
            graficarFuncion(x_vals, y_vals, expresion);

        } catch (error) {
            Swal.fire("Error", "Función inválida. Inténtalo de nuevo.", "error");
        }
    });

    function graficarFuncion(x_vals, y_vals, expresion) {
        let ctx = document.getElementById("grafica").getContext("2d");

        if (grafica) grafica.destroy();

        grafica = new Chart(ctx, {
            type: "line",
            data: {
                labels: x_vals,
                datasets: [{
                    label: `f(x) = ${expresion}`,
                    data: y_vals,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: "x" } },
                    y: { title: { display: true, text: "f(x)" } }
                }
            }
        });
    }
});
