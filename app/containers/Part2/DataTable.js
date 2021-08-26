import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';

const DataTable = props => {
  const { dataList, isLoading, selectedRowKeys, setSelectedRowKeys } = props;

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
      title: 'Call ID',
      dataIndex: 'call_id',
      sortOrder:
        sortedInfo && sortedInfo.field === 'call_id' && sortedInfo.order,
      sorter: (a, b) => a.call_id - b.call_id,
      width: '30%',
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      width: '70%',
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setState({
      ...initialState,
      pagination,
      sortedInfo: sorter,
    });
  };

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default DataTable;
