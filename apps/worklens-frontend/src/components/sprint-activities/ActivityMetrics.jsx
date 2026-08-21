import { useMemo } from "react";
import "../../styles/sprint-activities/ActivityMetrics.css";

/**
 * ActivityMetrics
 * Displays a concise dashboard summary of sprint activity execution status.
 *
 * @param {{ activities: Array<Object> }} props
 */
function ActivityMetrics({ activities = [] }) {
  const stats = useMemo(() => {
    let total = activities.length;
    let passed = 0;
    let failed = 0;
    let notExecuted = 0;
    let needAgain = 0;
    let parentCount = 0;
    let scenarioCount = 0;

    for (const act of activities) {
      const info = act.simpleActivityInfo ?? {};
      const typeName = String(info.activityType?.name ?? "").toLowerCase();
      if (typeName === "parent") parentCount++;
      else scenarioCount++;

      const statusName = String(
        act.currentStatus?.statusName ??
        info.currentStatus?.statusName ??
        ""
      ).toLowerCase();

      if (statusName.includes("passed")) {
        passed++;
      } else if (statusName.includes("failed")) {
        failed++;
      } else if (statusName.includes("need")) {
        needAgain++;
      } else if (statusName.includes("not executed") || !statusName) {
        notExecuted++;
      } else if (statusName.includes("atleast")) {
        passed++;
      } else {
        notExecuted++;
      }
    }

    const executed = total - notExecuted;
    const executionRate = total > 0 ? Math.round((executed / total) * 100) : 0;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return {
      total,
      passed,
      failed,
      notExecuted,
      needAgain,
      parentCount,
      scenarioCount,
      executed,
      executionRate,
      passRate,
    };
  }, [activities]);

  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <section className="sa-metrics" aria-label="Sprint Activity Metrics">
      {/* Total Card */}
      <div className="sa-metrics__card sa-metrics__card--total">
        <div className="sa-metrics__icon sa-metrics__icon--total">
          <i className="bi bi-collection" />
        </div>
        <div className="sa-metrics__content">
          <span className="sa-metrics__label">Total Activities</span>
          <div className="sa-metrics__value-wrap">
            <span className="sa-metrics__value">{stats.total}</span>
            <span className="sa-metrics__sub">
              {stats.parentCount} parents • {stats.scenarioCount} scenarios
            </span>
          </div>
        </div>
      </div>

      {/* Passed Card */}
      <div className="sa-metrics__card sa-metrics__card--passed">
        <div className="sa-metrics__icon sa-metrics__icon--passed">
          <i className="bi bi-check-circle-fill" />
        </div>
        <div className="sa-metrics__content">
          <span className="sa-metrics__label">Passed</span>
          <div className="sa-metrics__value-wrap">
            <span className="sa-metrics__value">{stats.passed}</span>
            <span className="sa-metrics__sub">{stats.passRate}% pass rate</span>
          </div>
        </div>
      </div>

      {/* Failed Card */}
      <div className="sa-metrics__card sa-metrics__card--failed">
        <div className="sa-metrics__icon sa-metrics__icon--failed">
          <i className="bi bi-x-circle-fill" />
        </div>
        <div className="sa-metrics__content">
          <span className="sa-metrics__label">Failed</span>
          <div className="sa-metrics__value-wrap">
            <span className="sa-metrics__value">{stats.failed}</span>
            <span className="sa-metrics__sub">
              {stats.failed > 0 ? "Requires review" : "No issues"}
            </span>
          </div>
        </div>
      </div>

      {/* Pending / Not Executed Card */}
      <div className="sa-metrics__card sa-metrics__card--pending">
        <div className="sa-metrics__icon sa-metrics__icon--pending">
          <i className="bi bi-hourglass-split" />
        </div>
        <div className="sa-metrics__content">
          <span className="sa-metrics__label">Not Executed</span>
          <div className="sa-metrics__value-wrap">
            <span className="sa-metrics__value">{stats.notExecuted}</span>
            <span className="sa-metrics__sub">
              {stats.needAgain > 0 ? `${stats.needAgain} need re-test` : "Pending run"}
            </span>
          </div>
        </div>
      </div>

      {/* Execution Progress Card */}
      <div className="sa-metrics__card sa-metrics__card--progress">
        <div className="sa-metrics__content sa-metrics__content--full">
          <div className="sa-metrics__progress-head">
            <span className="sa-metrics__label">Execution Progress</span>
            <span className="sa-metrics__progress-pct">{stats.executionRate}%</span>
          </div>
          <div
            className="sa-metrics__progress-bar"
            role="progressbar"
            aria-valuenow={stats.executionRate}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="sa-metrics__progress-fill"
              style={{ width: `${stats.executionRate}%` }}
            />
          </div>
          <span className="sa-metrics__sub">
            {stats.executed} of {stats.total} executed
          </span>
        </div>
      </div>
    </section>
  );
}

export default ActivityMetrics;
