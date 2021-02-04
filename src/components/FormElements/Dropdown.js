import React from 'react';
import _ from 'lodash';

const Dropdown = props => (

    <React.Fragment>
        <label htmlFor={props.name}>{_.startCase(props.name)}</label>
        <div>
            <select 
                required
                className="browser-default custom-select" 
                onChange={props.change}
                value={props.value}
                disabled={props.disabled ? props.disabled : ''}>

                    <option value="">Select a Category</option>
                    { props.options && props.options.map(option => (
                        <option 
                            key={option.id} 
                            value={option.id} 
                        >
                            {option.title}
                        </option>
                    ))}

            </select>
        </div>
    </React.Fragment>

)

export default Dropdown