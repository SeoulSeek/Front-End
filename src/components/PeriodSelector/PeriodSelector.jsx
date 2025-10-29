import React from "react";
import $ from "./PeriodSelector.module.css";

const PeriodSelector = ({
  eras,
  selectedEraIndex,
  onSelect,
  availableEraKey,
}) => {
  return (
    <div className={$.periodList}>
      {eras.map((era, index) => {
        const isAvailable = era.eraKey === availableEraKey;
        const isSelected = selectedEraIndex === index;

        return (
          <div className={$.period} key={index}>
            <button
              key={index}
              disabled={!isAvailable}
              className={`${$.button} 
                ${isSelected ? $.selected : ""} 
                ${!isAvailable ? $.disabled : $.unselected}`}
              onClick={() => isAvailable && onSelect(index)}
            >
              {era.name}
            </button>
            <p>{era.year}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PeriodSelector;
