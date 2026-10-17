import React from 'react';

const TemporalCoverage = (props) => {
  const { temporalCoverage } = props;
  const startTempCoverage = temporalCoverage.at(0);
  const endTempCoverage = temporalCoverage.at(-1);

  return temporalCoverage && temporalCoverage.length > 0 ? (
    <>
      {Array.isArray(temporalCoverage) ? (
        <div className="temporal-coverage">
          <div className="side-year">{parseInt(startTempCoverage) - 1}</div>
          <div className="time-range">
            <span>
              {startTempCoverage} - {endTempCoverage}
            </span>
          </div>
          <div className="side-year">{parseInt(endTempCoverage) + 1}</div>
        </div>
      ) : (
        <div className="temporal-coverage">
          <div className="side-year">{parseInt(temporalCoverage) - 1}</div>
          <div className="time-range">
            <span>{temporalCoverage}</span>
          </div>
          <div className="side-year">{parseInt(temporalCoverage) + 1}</div>
        </div>
      )}
    </>
  ) : null;
};

export default TemporalCoverage;
