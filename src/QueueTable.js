import React from "react";
import { useTable, useFilters } from "react-table";
import axios from "axios";
import {DefaultFilterForColumn} from "./Filter";

function QueueTable({ data, columns,onChangeHandler }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
    useTable({ columns, data, defaultColumn: { Filter: DefaultFilterForColumn },}, useFilters);

  return (
      <>
        <input
            type="search"
            className="form-control rounded"
            placeholder="Search"
            onChange={onChangeHandler}
        />
    <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
              ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
      </>
  );
}

function getColumnsX() {
    return [
      {
        Header: "Info",
        columns: [
          {
            Header: "Queue Name",
            accessor: "queueName",
            disableFilters: true,
          },
          {
            Header: "Label",
            accessor: "label",
          },
        ],
      },
      {
        Header: "Counters",
        columns: [
          {
            Header: "1h",
            accessor: "cnt1h",
            disableFilters: true,
          },
          {
            Header: "10min",
            accessor: "cnt10m",
            disableFilters: true,
          },
          {
            Header: "1min",
            accessor: "cnt1m",
            disableFilters: true,
          },
        ],
      },{
        Header: "Status",
        columns: [
          {
            Header: "Last Date",
            accessor: "lastDate",
            disableFilters: true,
          },
          {
            Header: "Status",
            accessor: "status",
            disableFilters: true,
          },
        ],
      }
    ];
  }

class LoadedQueueTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered: false,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 10000);
    this.tick();
  }

  async tick() {
      const ts = new Date().getTime();
      if (!this.state.filtered) {
        this.setState({filtered: false});
        axios.get('/api/queues?_=' + ts).then((res) => {
          this.setState({
            data: res.data
          });
        });
        console.log("Внутри tick, filtered = " + this.state.filtered);
        console.log("this.state after get: " + String(this.state.data));
      }
    }

    componentWillUnmount()
    {
      clearInterval(this.timerID);
    }

    onChangeHandler = e => {
      const value = e.target.value;
      const needFilter = (value !== ""); //true если пользователь что-то ввел
      const ts = new Date().getTime();
      const param = needFilter ? ("?label=" + value) : ("?_="+ts);
      this.setState({filtered:needFilter});
      axios.get('/api/queues' + param).then((res) => {
        this.setState({
          data: res.data
        });
        console.log("this.state after filter: " + String(this.state.data));
        console.log("filtered: " + this.state.filtered);
      });
    }

    render()
    {
      return <QueueTable columns={getColumnsX()} data={this.state.data} onChangeHandler={this.onChangeHandler}/>;
    }
  }

export default LoadedQueueTable;
