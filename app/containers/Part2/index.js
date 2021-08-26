/**
 *
 * Part2
 *
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Form } from 'react-final-form';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import UpdateIcon from '@material-ui/icons/Update';

import { API_ENDPOINTS, BASE_URL, USER_ID } from './constants';
import DataTable from './DataTable';
import './styles.scss';

export const Part2 = () => {
  const [listOfLabels, setListOfLabels] = useState([]);
  const [callList, setCallList] = useState([]);
  const [addLabels, setAddLabels] = useState([]);
  const [removeLabels, setRemoveLabels] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [newLabel, setNewLabel] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!listOfLabels.length) {
      getListOfLabels();
    }
    if (!callList.length) {
      getCallList();
    }
  });

  const handleSetCallList = callData => {
    const callDataList = (callData || []).map(row => {
      let labels = '';
      (row.label_id || []).forEach(label => {
        labels += label;
        labels += ' | ';
      });

      return {
        ...row,
        key: row.call_id,
        labels: labels.substr(0, labels.length - 3),
      };
    });

    setCallList(callDataList);
  };

  const getListOfLabels = () => {
    axios({
      method: 'GET',
      url: BASE_URL + API_ENDPOINTS.getListOfLabels,
      headers: {
        user_id: USER_ID,
      },
    }).then(res => {
      if (res && res.data && res.data.data && res.data.data.unique_label_list) {
        const uniqueLabelList = res.data.data.unique_label_list;
        setListOfLabels(uniqueLabelList);
      }
    });
  };

  const getCallList = () => {
    axios({
      method: 'GET',
      url: BASE_URL + API_ENDPOINTS.getCallList,
      headers: {
        user_id: USER_ID,
      },
    }).then(res => {
      if (res && res.data && res.data.data && res.data.data.call_data) {
        const callData = res.data.data.call_data;

        handleSetCallList(callData);
      }
    });
  };

  const getListOfLabelsArray = () =>
    listOfLabels.map(value => ({
      value,
      label: value,
    }));

  const handleAddLabel = val => {
    setAddLabels(val);
  };

  const handleRemoveLabel = val => {
    setRemoveLabels(val);
  };

  const isLabelDataValid = () => {
    let isValid = true;

    if (!addLabels.length && !removeLabels.length && !newLabel.length) {
      toastr.error('Please select at least 1 Label', 'Error');
      return (isValid = false);
    }

    if (!selectedRowKeys.length) {
      toastr.error('Please select at least 1 Call ID', 'Error');
      return (isValid = false);
    }

    isValid = true;
    return isValid;
  };

  const getAddLabelList = () => {
    let data = (addLabels || []).map(label => ({
      name: label.value,
      op: 'add',
    }));

    if (newLabel.length) {
      data = [
        ...data,
        {
          name: newLabel,
          op: 'add',
        },
      ];
    }

    data = data.concat(getRemoveLabelList());
    return data;
  };

  const getRemoveLabelList = () =>
    (removeLabels || []).map(label => ({
      name: label.value,
      op: 'remove',
    }));

  const applyLabels = data => {
    setIsLoading(true);
    toastr.warning('Updating and Fetching Data', 'Please Wait!');

    axios({
      method: 'POST',
      url: BASE_URL + API_ENDPOINTS.applyLabels,
      headers: {
        user_id: USER_ID,
      },
      data,
    })
      .then(response => {
        const res = response.data;
        if (res && res.status_code === 200) {
          getCallList();
          getListOfLabels();
          toastr.remove();
          toastr.success('Successfully Applied', 'Success');
          setIsLoading(false);
        } else if (res && res.message) {
          toastr.remove();
          toastr.error(res.message, 'Error');
          setIsLoading(false);
        } else {
          toastr.remove();
          toastr.error('Something went wrong!', 'Error');
          setIsLoading(false);
        }
        setIsLoading(false);
      })
      .catch(() => {
        toastr.remove();
        toastr.error('Something went wrong!', 'Error');
        setIsLoading(false);
      });
    setIsLoading(false);
  };

  const handleInputChange = e => {
    setNewLabel(e.target.value);
  };

  const handleUpdateClick = () => {
    if (isLabelDataValid()) {
      const dataObj = {
        operation: {
          callList: selectedRowKeys,
          label_ops: getAddLabelList(),
        },
      };
      applyLabels(dataObj);
      setSelectedRowKeys([]);
      setAddLabels([]);
      setRemoveLabels([]);
      setNewLabel('');
    }
  };

  return (
    <div className="part2Container">
      <Form
        onSubmit={handleUpdateClick}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="filterFormDiv">
              <div className="formInputDiv">
                <div className="addLabelDiv">
                  <label>Add Labels</label>
                  <div className="addLabelSelectDiv">
                    <Select
                      name="addLabel"
                      options={getListOfLabelsArray()}
                      onChange={handleAddLabel}
                      value={addLabels}
                      isMulti
                      searchable
                    />
                  </div>
                </div>
                <div className="removeLabelDiv">
                  <label>Remove Labels</label>
                  <div className="removeLabelSelectDiv">
                    <Select
                      name="removeLabel"
                      options={getListOfLabelsArray()}
                      onChange={handleRemoveLabel}
                      value={removeLabels}
                      isMulti
                      searchable
                    />
                  </div>
                </div>
                <div className="removeLabelDiv">
                  <label>Create Label</label>
                  <div className="addLabelInputDiv">
                    <input
                      className="addLabelInput"
                      placeholder="Create Label"
                      value={newLabel}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="searchButtonDiv">
                <button className="searchButton">
                  <UpdateIcon className="searchIcon" />
                </button>
              </div>
            </div>
          </form>
        )}
      />
      <div className="tableDiv">
        <DataTable
          dataList={callList}
          isLoading={isLoading}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </div>
    </div>
  );
};

export default Part2;
