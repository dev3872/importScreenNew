import { Dropdown, Menu, Select, Space, Table } from "antd";
import {DownOutlined} from "@ant-design/icons"
import "antd/dist/antd.css";
import React, { useState } from "react";
const { Column } = Table;
const {Option} = Select

const AntdTable = (props) => {
	const [values, setValues] = useState("")
	return (
	<Table dataSource={props.data}>
		<Column title="First Name" dataIndex="firstName" key="firstName" />
		<Column title="Last Name" dataIndex="lastName" key="lastName" />
		<Column title={<Dropdown title={"dropdown"} overlay={<Menu items={[{key:'1',label:<span data-testid="ascending" onClick={()=>{console.log("Clicked here"); props.sortRow('age','ascending')}}>Ascending</span>},{key:'2',label:<span data-testid="descending" onClick={()=>{console.log("Clicked here");props.sortRow('age','descending')}}>Descending</span>}]}/>} trigger={['click']}><Space>Age <DownOutlined/></Space></Dropdown>} dataIndex="age" key="age" />
		<Column title="Address" dataIndex="address" key="address" />
		<Column
			title="Tags"
			dataIndex="tags"
			key="tags"
			render={(value,record) => (
				<Select data-testid="select-option" value={values.length>0?values:value} onChange={(e)=>setValues(e)}>
					<Option value="Yes" data-testid="select-option-yes">Yes</Option>
					<Option value="No" data-testid="select-option-no">No</Option>
				</Select>
			)}
		/>
		<Column
			title="Action"
			key="action"
			render={(_, record) => (
				<Space size="middle">
					<a>Invite {record.lastName}</a>
					<a>Delete</a>
				</Space>
			)}
		/>
	</Table>
)
};

export default AntdTable;
