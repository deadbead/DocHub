import requests from '../helpers/requests';
import axios from 'axios';
import plantUML from '../helpers/plantuml';

export default {
	request(params) {
		params.url = window.origin + params.url.slice(19);
		return requests.axios(params);
	},
	renderPlantUML(uml) {
		return axios({url: plantUML.svgURL(uml)});
	},
	messagePull: function() {
		return new Promise(function(resolve) {
			resolve({});
		});
	},
	initProject: function() {
		// eslint-disable-next-line no-console
		console.info('Call init ptoject');
	},
	showDebugger: function() {
		// eslint-disable-next-line no-debugger
		debugger;
	},
	reload() {
		window.location.reload();
	},
	goto(source, entity, id) {
		// eslint-disable-next-line no-console
		console.info(`Call goto ${source}#${entity}\\${id}`);
	},
	download(content, title, description, extension) {
		// eslint-disable-next-line no-console
		console.info(`${title}:${description}:${extension}`);
		// eslint-disable-next-line no-console
		console.info('Content', content);
	},
	applyEntitiesSchema(schema) {
		// eslint-disable-next-line no-console
		console.info('Custom entities JSON Schema: ', JSON.parse(schema));
	},
	copyToClipboard: function(data) {
		// eslint-disable-next-line no-console
		console.info('Copy to clipboard: ', data);
	}
};
