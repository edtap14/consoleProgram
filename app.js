import colors from 'colors';
import { guardarDB, leerArchivo } from './helpers/guardarArchivo.js';
import {
	inquireMenu,
	pausa,
	leerInput,
	listadoTareasBorrar,
	confirmar,
	mostrarListadoChecklist,
} from './helpers/inquirer.js';
import { Tareas } from './models/tareas.js';

const main = async () => {
	let opt = '';
	const tareas = new Tareas();

	const tareasDB = leerArchivo();

	if (tareasDB) {
		tareas.cargarTareasFromArr(tareasDB);
	}

	do {
		opt = await inquireMenu();

		switch (opt) {
			case '1':
				// crear opcion
				const desc = await leerInput('Descripcion:');
				tareas.crearTarea(desc);
				break;
			case '2':
				//listado de las tareas
				// console.log(tareas.listadoArr);
				tareas.listadoCompleto();
				break;
			case '3':
				tareas.listarPendientesCompletadas(true);
				break;
			case '4':
				tareas.listarPendientesCompletadas(false);
				break;
			case '5':
				const ids = await mostrarListadoChecklist(tareas.listadoArr);
				tareas.toggleCompletadas(ids);
				break;
			case '6':
				const id = await listadoTareasBorrar(tareas.listadoArr);
				if (id !== '0') {
					const ok = await confirmar('¿Estás seguro?');
					if (ok) {
						tareas.borrarTarea(id);
						console.log('Tarea borrado con éxito');
					}
				}
				break;
			default:
				break;
		}

		guardarDB(tareas.listadoArr);

		await pausa();
	} while (opt !== '0');
};

main();
