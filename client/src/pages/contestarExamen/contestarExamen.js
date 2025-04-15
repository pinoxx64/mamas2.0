import { getExamenById } from "../../components/examenApi";

document.addEventListener('DOMContentLoaded', async () => {
    const examenId = sessionStorage.getItem('examenId');
    const examen = await getExamenById(examenId);
    const mainContent = document.querySelector('.main-content');

    if (!examen || !examen.examen) {
        mainContent.innerHTML = "<p class='text-danger'>No se pudo cargar el examen. Por favor, inténtelo más tarde.</p>";
        return;
    }

    // Crear el formulario del examen
    const form = document.createElement('form');
    form.id = 'examenForm';

    // Título del examen
    const titulo = document.createElement('h2');
    titulo.textContent = examen.examen.nombre;
    form.appendChild(titulo);

    // Iterar sobre las preguntas
    examen.examen.preguntas.forEach((pregunta, index) => {
        const preguntaContainer = document.createElement('div');
        preguntaContainer.classList.add('mb-4');

        // Título de la pregunta
        const preguntaTitulo = document.createElement('h5');
        preguntaTitulo.textContent = `${index + 1}. ${pregunta.pregunta}`;
        preguntaContainer.appendChild(preguntaTitulo);

        // Generar el campo de respuesta según el tipo de pregunta
        if (pregunta.tipo === 'texto' || pregunta.tipo === 'numero') {
            // Campo de entrada para texto o número
            const input = document.createElement('input');
            input.type = pregunta.tipo === 'texto' ? 'text' : 'number';
            input.classList.add('form-control');
            input.name = `respuesta_${pregunta.id}`;
            input.placeholder = 'Escribe tu respuesta aquí';
            preguntaContainer.appendChild(input);
        } else if (pregunta.tipo === 'opciones individuales' || pregunta.tipo === 'opciones multiples') {
            // Drag and drop para opciones
            const opcionesContainer = document.createElement('div');
            opcionesContainer.classList.add('d-flex', 'gap-2', 'flex-wrap', 'mb-2');
            opcionesContainer.id = `opciones_${pregunta.id}`;

            const respuestaContainer = document.createElement('div');
            respuestaContainer.classList.add('border', 'p-3', 'rounded', 'bg-light');
            respuestaContainer.id = `respuesta_${pregunta.id}`;
            respuestaContainer.style.minHeight = '50px';
            respuestaContainer.textContent = 'Arrastra aquí tu respuesta';
            respuestaContainer.dataset.tipo = pregunta.tipo;

            // Crear opciones como elementos drag and drop
            const opciones = pregunta.opciones ? pregunta.opciones.split('\n') : [];
            opciones.forEach(opcion => {
                const opcionElement = document.createElement('div');
                opcionElement.classList.add('p-2', 'border', 'rounded', 'bg-white', 'draggable');
                opcionElement.draggable = true;
                opcionElement.textContent = opcion;
                opcionElement.dataset.value = opcion;

                // Eventos drag and drop
                opcionElement.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', opcion);
                });

                opcionesContainer.appendChild(opcionElement);
            });

            // Eventos para el contenedor de respuestas
            respuestaContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            respuestaContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                const opcion = e.dataTransfer.getData('text/plain');

                if (pregunta.tipo === 'opciones individuales' && respuestaContainer.children.length > 0) {
                    alert('Solo puedes seleccionar una opción.');
                    return;
                }

                const opcionElement = document.createElement('div');
                opcionElement.classList.add('p-2', 'border', 'rounded', 'bg-success', 'text-white', 'mb-1');
                opcionElement.textContent = opcion;
                opcionElement.dataset.value = opcion;

                // Agregar la opción al contenedor de respuestas
                respuestaContainer.appendChild(opcionElement);
            });

            preguntaContainer.appendChild(opcionesContainer);
            preguntaContainer.appendChild(respuestaContainer);
        }

        form.appendChild(preguntaContainer);
    });

    // Botón para enviar el formulario
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('btn', 'btn-success');
    submitButton.textContent = 'Enviar respuestas';
    form.appendChild(submitButton);

    // Manejar el envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const respuestas = {};
        examen.examen.preguntas.forEach(pregunta => {
            if (pregunta.tipo === 'texto' || pregunta.tipo === 'numero') {
                const input = form.querySelector(`[name="respuesta_${pregunta.id}"]`);
                respuestas[pregunta.id] = input.value;
            } else if (pregunta.tipo === 'opciones individuales' || pregunta.tipo === 'opciones multiples') {
                const respuestaContainer = document.getElementById(`respuesta_${pregunta.id}`);
                const seleccionadas = Array.from(respuestaContainer.children).map(child => child.dataset.value);
                respuestas[pregunta.id] = seleccionadas;
            }
        });

        console.log('Respuestas enviadas:', respuestas);
        alert('Tus respuestas han sido enviadas.');
    });

    mainContent.appendChild(form);
});