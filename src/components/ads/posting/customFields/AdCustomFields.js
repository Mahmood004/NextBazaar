import React from 'react';
import _ from 'lodash';
import '../AdPosting.css';

// value={(!_.isEmpty(props.cfUpdatedValues) && Object.keys(props.cfUpdatedValues).filter(key => key === props._id)) ? props.cfUpdatedValues[props._id] : props.value ? props.value : ''}

const AdCustomFields = props => {

    let field;
    console.log(props.cfUpdatedValues);
    if (props.type === 'text') {

        if (props.name.toLowerCase().includes('date')) {
            field = (
                <input type="date" id={props._id} name={_.camelCase(props.name)} value={(!_.isEmpty(props.cfUpdatedValues) && Object.keys(props.cfUpdatedValues).filter(key => key === props._id)) ? props.cfUpdatedValues[props._id] : ''} onChange={props.changed} required={props.required ? true : false} className="form-control" />
            );
        } else {
            field = (
                <input type={props.type} id={props._id} name={_.camelCase(props.name)} value={(!_.isEmpty(props.cfUpdatedValues) && Object.keys(props.cfUpdatedValues).filter(key => key === props._id)) ? props.cfUpdatedValues[props._id] : ''} onChange={props.changed} required={props.required ? true : false} className="form-control" />
            );
        }

    }

    if (props.type === 'select') {

        field = (
            <div>
                <select className="browser-default custom-select" onChange={props.changed} id={props._id} value={(!_.isEmpty(props.cfUpdatedValues) && Object.keys(props.cfUpdatedValues).filter(key => key === props._id)) ? props.cfUpdatedValues[props._id] : ''}>
                    <option value="">Select {props.name}</option>
                    { props.options.length && props.options.map(option => (
                        <option 
                            key={option._id} 
                            value={option._id}
                        >
                            {option.value}
                        </option>
                    ))}
                </select>
            </div>
        );

    }

    if (props.type === 'radio') {

        field = [];

        field = props.options.map((option, index) => (
            <label key={index} className="radio-inline">
                <input type={props.type} onChange={props.changed} value={option.id} checked={!_.isEmpty(props.cfUpdatedValues) && Object.keys(props.cfUpdatedValues).filter(key => key === props._id) && props.cfUpdatedValues[props._id] === option.id} id={props._id} name={_.camelCase(props.name)} required={props.required ? true : false} />
                {option.value}
            </label>
        ));

    }

    if (props.type === 'file') {

        field = (
            <div className="custom-file">
                <input type={props.type} id={props._id} onChange={props.changed} className="custom-file-input" />
                <label className="custom-file-label" htmlFor={_.camelCase(props.name)}>Upload {props.name}</label>
            </div>
        )
    }

    if (props.type === 'checkbox' || props.type === 'checkbox_multiple') {

        if (props.type === 'checkbox') {

            field = (
                <label className="checkbox-inline">
                    <input type={props.type} name={_.camelCase(props.name)} id={props._id} onChange={props.changed} required={props.required ? true : false} />
                    {props.name}
                </label>
            );

        } else {
            // checked={(!_.isEmpty(props.cfUpdatedValues) && Object.keys(props.cfUpdatedValues).filter(key => key === props._id) && Object.keys(props.cfUpdatedValues[props._id]).filter(key => key === option._id)) ? props.cfUpdatedValues[props._id][option._id] : props.value && Object.keys(props.value).filter(cb => props.value[cb] === option._id) ? true : false}
            field = [];

            field = props.options.map((option, index) => (
                <label key={index} className="checkbox-inline">
                    <input type="checkbox" name={_.camelCase(props.name)} id={props._id} labelid={option._id} onChange={props.changed} required={props.required ? true : false} />
                    {option.value}
                </label>
            ));
        }

    }

    return (
        <div className="formElement form-group">
            {props.type !== 'checkbox' && <label htmlFor={_.camelCase(props.name)}>{_.startCase(_.toLower(props.name))}</label>}
            {field}
        </div>
    )
}

export default AdCustomFields;