import "./App.css";
import AntdTable from "./AntTable";
import { data } from "./data";
import { useState } from "react";
export const sortFunction = (field, attribute, order) => {
	if (order === "ascending") {
		//ascending
		return field.sort((a, b) =>
			a[attribute] > b[attribute] ? 1 : b[attribute] > a[attribute] ? -1 : 0
		);
	} else {
		//descending
		return field.sort((a, b) =>
			a[attribute] < b[attribute] ? 1 : b[attribute] < a[attribute] ? -1 : 0
		);
	}
};
function App() {
	const [field, setField] = useState(data);
	const sortRow = (attribute, order) => {
		setField([...sortFunction(field,attribute,order)])
	};
	return (
		<div className="App">
			<AntdTable data={field} sortRow={sortRow}/>
		</div>
	);
}

export default App;
