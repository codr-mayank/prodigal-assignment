/**
 *
 * Part1
 *
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Form } from 'react-final-form';
import SearchIcon from '@material-ui/icons/Search';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import { API_ENDPOINTS, BASE_URL } from './constants';
import DataTable from './DataTable';
import './styles.scss';

export const Part1 = () => {
  const [listOfAgents, setListOfAgents] = useState([]);
  const [durationRange, setDurationRange] = useState({
    maximum: null,
    minimum: null,
  });
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedMinimum, setSelectedMinimum] = useState(null);
  const [selectedMaximum, setSelectedMaximum] = useState(null);
  const [filteredAgentList, setFilteredAgentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!listOfAgents.length) {
      getListOfAgents();
    }
    if (durationRange.maximum === null || durationRange.minimum === null) {
      getDurationRange();
    }
  });

  const getListOfAgents = () => {
    axios({
      method: 'GET',
      url: BASE_URL + API_ENDPOINTS.getListOfAgents,
    }).then(res => {
      if (res && res.data && res.data.data && res.data.data.listofagents) {
        setListOfAgents(res.data.data.listofagents);
      }
    });
  };

  const getDurationRange = () => {
    axios({
      method: 'GET',
      url: BASE_URL + API_ENDPOINTS.getDurationRange,
    }).then(res => {
      if (res && res.data && res.data.data && res.data.data) {
        setDurationRange({
          maximum: res.data.data.maximum,
          minimum: res.data.data.minimum,
        });
      }
    });
  };

  const getListOfAgentsArray = () =>
    listOfAgents.map(value => ({
      value,
      label: value,
    }));

  const handleSelectAgent = val => {
    setSelectedAgents(val);
  };

  const handleKeyDown = e => {
    (e.keyCode === 69 || e.keyCode === 189 || e.keyCode === 190) &&
    e.preventDefault();
  };

  const handleDurationInputChange = (e, type) => {
    const val = e && e.target.value;
    if (val < durationRange.minimum || val > durationRange.maximum) {
      return;
    }
    if (type === 'min') {
      setSelectedMinimum(e.target.value);
    } else if (type === 'max') {
      setSelectedMaximum(e.target.value);
    }
  };

  const isFilterDataValid = () => {
    let isValid = true;

    if (!selectedAgents.length) {
      toastr.error('Please select at least 1 agent', 'Error');
      return (isValid = false);
    }
    if (selectedMinimum === null || selectedMaximum === null) {
      toastr.error('Please enter valid Duration Range', 'Error');
      return (isValid = false);
    }
    if (parseInt(selectedMinimum) >= parseInt(selectedMaximum)) {
      toastr.error('From TimeRange should be less than To TimeRange', 'Error');
      return (isValid = false);
    }

    isValid = true;
    return isValid;
  };

  const getFilterAgentList = () =>
    (selectedAgents || []).map(agent => agent.value);

  const getFilteredCallsList = data => {
    setIsLoading(true);
    toastr.warning('Fetching Data', 'Please Wait!');

    axios({
      method: 'POST',
      url: BASE_URL + API_ENDPOINTS.getFilteredCalls,
      data,
    })
      .then(res => {
        if (res && res.status === 200) {
          if (res && res.data && res.data.data && res.data.data) {
            setFilteredAgentList(res.data.data);
            setIsLoading(false);
            toastr.remove();
            if (res.data.data.length) {
              toastr.success('Successfully Fetched Call List', 'Success');
            } else {
              toastr.success('No Data Found for Selected Filters', 'Success');
            }
          }
        } else if (res && res.message) {
          toastr.remove();
          toastr.error(res.message, 'Error');
          setIsLoading(false);
        } else {
          toastr.remove();
          toastr.error('Something went wrong!', 'Error');
          setIsLoading(false);
        }
      })
      .catch(() => {
        toastr.remove();
        toastr.error('Something went wrong!', 'Error');
        setIsLoading(false);
      });
    setIsLoading(false);
  };

  const handleSearchClick = () => {
    if (isFilterDataValid()) {
      const dataObj = {
        info: {
          filter_agent_list: getFilterAgentList(),
          filter_time_range: [
            parseInt(selectedMinimum),
            parseInt(selectedMaximum),
          ],
        },
      };
      getFilteredCallsList(dataObj);
    }
  };

  return (
    <div className="part1Container">
      <Form
        onSubmit={handleSearchClick}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="filterFormDiv">
              <div className="formInputDiv">
                <div className="agentFilterDiv">
                  <label>Agent</label>
                  <div className="agentFilterSelectDiv">
                    <Select
                      name="agent"
                      options={getListOfAgentsArray()}
                      onChange={handleSelectAgent}
                      value={selectedAgents}
                      isMulti
                      searchable
                    />
                  </div>
                </div>

                <div className="durationRangeFilterDiv">
                  <label>
                    Call Duration (
                    {durationRange.minimum && durationRange.minimum.toFixed(2)}{' '}
                    To{' '}
                    {durationRange.maximum && durationRange.maximum.toFixed(2)})
                  </label>
                  <div>
                    <input
                      className="durationInput"
                      type="number"
                      placeholder="From"
                      value={selectedMinimum || ''}
                      onKeyDown={handleKeyDown}
                      onChange={e => handleDurationInputChange(e, 'min')}
                    />
                  </div>
                  <div>
                    <input
                      className="durationInput"
                      type="number"
                      placeholder="To"
                      value={selectedMaximum || ''}
                      onKeyDown={handleKeyDown}
                      onChange={e => handleDurationInputChange(e, 'max')}
                    />
                  </div>
                </div>
              </div>

              <div className="searchButtonDiv">
                <button className="searchButton">
                  <SearchIcon className="searchIcon"/>
                </button>
              </div>
            </div>
          </form>
        )}
      />
      <div className="tableDiv">
        <DataTable dataList={filteredAgentList} isLoading={isLoading}/>
      </div>
    </div>
  );
};

export default Part1;
