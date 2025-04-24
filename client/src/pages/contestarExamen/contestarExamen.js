import { getExamenById } from "../../components/examenApi";
import { postRespuestaExamen } from "../../components/respuestaExamenApi";

document.addEventListener('DOMContentLoaded', async () => {
    const examenId = sessionStorage.getItem('examenId');
    const userId = sessionStorage.getItem('userId');
    const examen = await getExamenById(examenId);
    const mainContent = document.querySelector('.main-content');

    if (!examen || !examen.examen) {
        mainContent.innerHTML = "<p class='text-danger'>No se pudo cargar el examen. Por favor, inténtelo más tarde.</p>";
        return;
    }

    const exam = document.createElement('form');
    exam.id = 'examenForm';

    const titulo = document.createElement('h2');
    titulo.textContent = examen.examen.nombre;
    exam.appendChild(titulo);

    examen.examen.preguntas.forEach((pregunta, index) => {
        const preguntaContainer = document.createElement('div');
        preguntaContainer.classList.add('mb-4');

        const preguntaTitulo = document.createElement('h5');
        preguntaTitulo.textContent = `${index + 1}. ${pregunta.pregunta}`;
        preguntaContainer.appendChild(preguntaTitulo);

        if (pregunta.tipo === 'texto' || pregunta.tipo === 'numero') {
            const input = document.createElement('input');
            input.type = pregunta.tipo === 'texto' ? 'text' : 'number';
            input.classList.add('form-control');
            input.name = `respuesta_${pregunta.id}`;
            input.placeholder = 'Escribe tu respuesta aquí';
            preguntaContainer.appendChild(input);
        } else if (pregunta.tipo === 'opciones individuales' || pregunta.tipo === 'opciones multiples') {
            const opcionesContainer = document.createElement('div');
            opcionesContainer.classList.add('d-flex', 'gap-2', 'flex-wrap', 'mb-2');
            opcionesContainer.id = `opciones_${pregunta.id}`;

            const respuestaContainer = document.createElement('div');
            respuestaContainer.classList.add('border', 'p-3', 'rounded', 'bg-light');
            respuestaContainer.id = `respuesta_${pregunta.id}`;
            respuestaContainer.style.minHeight = '50px';
            respuestaContainer.textContent = 'Arrastra aquí tu respuesta';
            respuestaContainer.dataset.tipo = pregunta.tipo;

            const limpiarButton = document.createElement('button');
            limpiarButton.type = 'button';
            limpiarButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'mt-2');
            limpiarButton.textContent = 'Limpiar';
            limpiarButton.addEventListener('click', () => {
                respuestaContainer.innerHTML = '';
                respuestaContainer.textContent = 'Arrastra aquí tu respuesta';
            });

            const opciones = pregunta.opciones ? pregunta.opciones.split('\\n') : [];
            opciones.forEach(opcion => {
                const opcionElement = document.createElement('div');
                opcionElement.classList.add('p-2', 'border', 'rounded', 'bg-white', 'draggable');
                opcionElement.draggable = true;
                opcionElement.textContent = opcion.trim();
                opcionElement.dataset.value = opcion.trim();

                opcionElement.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', opcion.trim());
                });

                opcionesContainer.appendChild(opcionElement);
            });

            respuestaContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            respuestaContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                const opcion = e.dataTransfer.getData('text/plain');

                if (pregunta.tipo === 'opciones individuales' && respuestaContainer.children.length > 0) {
                    return;
                }

                const opcionElement = document.createElement('div');
                opcionElement.classList.add('p-2', 'border', 'rounded', 'bg-success', 'text-white', 'mb-1');
                opcionElement.textContent = opcion;
                opcionElement.dataset.value = opcion;

                respuestaContainer.appendChild(opcionElement);
            });

            preguntaContainer.appendChild(opcionesContainer);
            preguntaContainer.appendChild(respuestaContainer);
            preguntaContainer.appendChild(limpiarButton);
        }

        exam.appendChild(preguntaContainer);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('btn', 'btn-success');
    submitButton.textContent = 'Enviar respuestas';
    exam.appendChild(submitButton);

    exam.addEventListener('submit', async (e) => {
        e.preventDefault();

        const respuestas = [];
        examen.examen.preguntas.forEach(pregunta => {
            if (pregunta.tipo === 'texto' || pregunta.tipo === 'numero') {
                const input = exam.querySelector(`[name="respuesta_${pregunta.id}"]`);
                respuestas.push({
                    examenId: examen.examen.id,
                    preguntaId: pregunta.id,
                    usuarioId: userId,
                    respuesta: input.value
                });
            } else if (pregunta.tipo === 'opciones individuales' || pregunta.tipo === 'opciones multiples') {
                const respuestaContainer = document.getElementById(`respuesta_${pregunta.id}`);
                const seleccionadas = Array.from(respuestaContainer.children).map(child => child.dataset.value);
                respuestas.push({
                    examenId: examen.examen.id,
                    preguntaId: pregunta.id,
                    usuarioId: userId,
                    respuesta: seleccionadas.join(', ')
                });
            }
        });
        await postRespuestaExamen(respuestas)
        console.log('Respuestas enviadas:', respuestas);
        window.location.href = '../resolverExamen/resolverExamen.html'
    });

    mainContent.appendChild(exam);
});