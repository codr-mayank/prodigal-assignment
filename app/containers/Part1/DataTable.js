import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';

const DataTable = props => {
  const { dataList, isLoading } = props;

  const initialState = {
    data: dataList,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sortedInfo: null,
    loading: isLoading,
  };

  const [state, setState] = useState(initialState);

  const { data, pagination, sortedInfo, loading } = state;

  useEffect(() => {
    setState(initialState);
  }, [dataList, isLoading]);

  const columns = [
    {
      title: 'Agent Name',
      dataIndex: 'agent_id',
      width: '40%',
    },
    {
      title: 'Call ID',
      dataIndex: 'call_id',
      sortOrder:
        sortedInfo && sortedInfo.field === 'call_id' && sortedInfo.order,
      sorter: (a, b) => a.call_id - b.call_id,
      width: '30%',
    },
    {
      title: 'Call Time (Duration)',
      dataIndex: 'call_time',
      sortOrder:
        sortedInfo && sortedInfo.field === 'call_time' && sortedInfo.order,
      sorter: (a, b) => a.call_time - b.call_time,
      width: '30%',
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setState({
      ...initialState,
      pagination,
      sortedInfo: sorter,
    });
  };

  return (
    <Table
      columns={columns}
      // rowKey={}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default DataTable;
