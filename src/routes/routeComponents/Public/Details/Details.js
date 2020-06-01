import React from 'react';
import { useSelector } from 'react-redux';
import { services } from 'orm/selectors';
import { useParams } from 'react-router';

import Button from '@material-ui/core/Button';

import './Details.scss';

const Details = () => {
  const { id } = useParams();
  const {
    category,
    description,
    duration,
    group_size: groupSize,
    minimum_requirments: minimumRequirments,
    price,
    title,
    // starts_at: startsAt,
    // created_at: createdAt,
    // updated_at: updatedAt,
  } = useSelector(state => services(state, id));

  return (
    <div className="details">
      <div className="details__category">{category}</div>
      <div className="details__title">{title}</div>
      <img
        src="https://source.unsplash.com/random/1200x600"
        className="details__image"
        alt="detail"
      />
      <div className="columns">
        <div className="columns__left">
          <div className="details__subtitle">Description</div>
          <div className="details__description">{description}</div>
          <div className="details__first">
            <span>Duration</span>
            {duration}
          </div>
          <div className="details__second">
            <span>Availability</span>
            always
          </div>
        </div>
        <div className="columns__right">
          <div className="details__subtitle">Requirements</div>
          <div>{minimumRequirments}</div>
          <div className="details__first">
            <span>Price</span>
            {price}
          </div>
          <div className="details__second">
            <span> Group size</span>
            {groupSize}
          </div>
        </div>
      </div>
      <div className="buttons">
        <Button size="small" color="primary">
          Start
        </Button>
      </div>
    </div>
  );
};

export default Details;
