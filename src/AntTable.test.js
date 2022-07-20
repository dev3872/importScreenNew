/* eslint-disable testing-library/no-node-access */
import {
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import axios from "axios";
import AntdTable from "./AntTable";
import { sortFunction } from "./App";
import { data } from "./data";
jest.mock("axios");
describe("AntTable", () => {
	test("should render table", () => {
		render(<AntdTable data={data} />);
		const table = screen.getByRole("table");
		expect(table).toBeInTheDocument();
	});
	test("should render table when data is missing", () => {
		render(<AntdTable />);
		const table = screen.getByRole("table");
		expect(table).toBeInTheDocument();
	});
	test("should render 6 columns", () => {
		render(<AntdTable data={data} />);
		const columns = screen.getAllByRole("columnheader");
		expect(columns).toHaveLength(6);
	});
	test("should render rows", () => {
		render(<AntdTable data={data} />);
		const rows = screen.getAllByRole("row");
		expect(rows).toHaveLength(4);
	});
	test("should have First Name, Last Name, Age, Address, Tags, Action", () => {
		render(<AntdTable data={data} />);
		expect(screen.getByText(/First Name/)).toBeDefined();
		expect(screen.getByText(/Last Name/)).toBeDefined();
		expect(screen.getByText(/Age/)).toBeDefined();
		expect(screen.getByText(/Address/)).toBeDefined();
		expect(screen.getByText(/Tags/)).toBeDefined();
		expect(screen.getByText(/Action/)).toBeDefined();
	});
	test("should render Yes/No as default value in Select", async () => {
		render(<AntdTable data={data} />);
		// eslint-disable-next-line testing-library/no-node-access
		const select = screen.getAllByTestId("select-option")[0].firstElementChild;
		fireEvent.keyDown(select);
		await waitFor(() => {
			expect(screen.getAllByTestId("select-option")[0]).toBeVisible();
		});
	});

	test("should change on click", async () => {
		render(<AntdTable data={data} />);
		const selectScreen =
			screen.getAllByTestId("select-option")[0].firstElementChild;
		fireEvent.mouseDown(selectScreen);
		await waitFor(() => {
			return expect(
				document.querySelector(".ant-select-dropdown")
			).toBeInTheDocument();
		});
		expect(screen.getByTestId("select-option-yes")).toBeInTheDocument();
		expect(screen.getByTestId("select-option-no")).toBeInTheDocument();
		fireEvent.click(screen.getByTestId("select-option-no"));
		expect(
			screen
				.getAllByTestId("select-option")[0]
				.getElementsByClassName("ant-select-selection-item")[0].textContent
		).toBe("No");
	});
	test("should display ascending and descending on click", async () => {
		render(<AntdTable />);
		fireEvent.click(document.querySelector(".ant-dropdown-trigger"));
		await waitFor(() => {
			return (
				expect(screen.getAllByRole("menuitem")[0]).toHaveTextContent(
					/Ascending/
				) &
				expect(screen.getAllByRole("menuitem")[1]).toHaveTextContent(
					/Descending/
				)
			);
		});
	});
	test("should sort table ascending on click on ascending option", async () => {
		const mockSortRow= jest.fn()
		render(<AntdTable data={data} sortRow={mockSortRow}/>);
		fireEvent.click(document.querySelector(".ant-dropdown-trigger"));
		await waitFor(() => {
			return fireEvent.click(screen.getByTestId("ascending"));
		});
		expect(mockSortRow).toHaveBeenCalledTimes(1)
		expect(mockSortRow).toHaveBeenCalledWith("age","ascending")
	});
	test("should sort table descending on click on descending option", async () => {
		const mockSortRow= jest.fn()
		render(<AntdTable data={data} sortRow={mockSortRow}/>);
		fireEvent.click(document.querySelector(".ant-dropdown-trigger"));
		await waitFor(() => {
			return fireEvent.click(screen.getByTestId("descending"));
		});
		expect(mockSortRow).toHaveBeenCalledTimes(1)
		expect(mockSortRow).toHaveBeenCalledWith("age","descending")
	});
});
describe("mock axios", () => {
	test("should get data from api", async () => {
		try {
			const data = {
				userId: 1,
				id: 1,
				title:
					"sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
				body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
			};
			axios.get.mockResolvedValue(data);
			const result = await axios.get(
				"https://jsonplaceholder.typicode.com/posts/1"
			);
			expect(result).toBe(data);
		} catch (e) {
			console.log(e);
		}
	});
});
describe('sortFunction', () => {
	test('should sort ascending when order is ascending', () => { 
		const mockSortFuntion = jest.fn(sortFunction)
		mockSortFuntion(data,"age","ascending")
		expect(mockSortFuntion.mock.calls[0][0]).toBe(data)
		expect(mockSortFuntion.mock.calls[0][1]).toBe("age")
		expect(mockSortFuntion.mock.calls[0][2]).toBe("ascending")
		const result = mockSortFuntion.mock.results[0].value
		expect(parseInt(result[0].age)).toBeLessThanOrEqual(parseInt(result[1].age))
	})
	test('should sort descending when order is descending', () => { 
		const mockSortFuntion = jest.fn(sortFunction)
		mockSortFuntion(data,"age","descending")
		expect(mockSortFuntion.mock.calls[0][0]).toBe(data)
		expect(mockSortFuntion.mock.calls[0][1]).toBe("age")
		expect(mockSortFuntion.mock.calls[0][2]).toBe("descending")
		const result = mockSortFuntion.mock.results[0].value
		expect(parseInt(result[0].age)).toBeGreaterThanOrEqual(parseInt(result[1].age))
	})
})
