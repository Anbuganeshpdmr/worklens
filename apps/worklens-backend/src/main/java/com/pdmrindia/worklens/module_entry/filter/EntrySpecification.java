package com.pdmrindia.worklens.module_entry.filter;

import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_entry.Entry;

import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;


public final class EntrySpecification {

    private EntrySpecification() {
    }

    public static Specification<Entry> withFilters(EntryFilterRequest request) {

        Specification<Entry> specification = (root, query, cb) -> null;

        if (request.getFromDate() != null) {
            specification = specification.and(activityDateGreaterThanOrEqualTo(request.getFromDate()));
        }

        if (request.getToDate() != null) {
            specification = specification.and(activityDateLessThanOrEqualTo(request.getToDate()));
        }

        if (hasValues(request.getUserIds())) {
            specification = specification.and(userIn(request.getUserIds()));
        }

        if (hasValues(request.getActivityIds())) {
            specification = specification.and(activityIn(request.getActivityIds()));
        }

        if (hasValues(request.getProjectIds())) {
            specification = specification.and(projectIn(request.getProjectIds()));
        }

        if (hasValues(request.getSprintIds())) {
            specification = specification.and(sprintIn(request.getSprintIds()));
        }

        /*if (hasValues(request.getActivityTypeIds())) {
            specification = specification.and(activityTypeIn(request.getActivityTypeIds()));
        }*/

        if (hasValues(request.getActivityTypeIds())) {
            specification = specification.and(
                    activityTypeIn(request.getActivityTypeIds())
            );
        }

        if (hasValues(request.getCategoryIds())) {
            specification = specification.and(
                    categoryIn(request.getCategoryIds())
            );
        }

        if (hasValues(request.getStatusIds())) {
            specification = specification.and(statusIn(request.getStatusIds()));
        }

        return specification;
    }

    private static Specification<Entry> activityDateGreaterThanOrEqualTo(LocalDate date) {

        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(
                        root.get("activityDate"),
                        date
                );
    }

    private static Specification<Entry> activityDateLessThanOrEqualTo(LocalDate date) {

        return (root, query, cb) ->
                cb.lessThanOrEqualTo(
                        root.get("activityDate"),
                        date
                );
    }

    private static Specification<Entry> userIn(List<Long> userIds) {

        return (root, query, cb) ->
                root.get("user").get("id").in(userIds);
    }

    private static Specification<Entry> activityIn(List<Long> activityIds) {

        return (root, query, cb) ->
                root.get("activity").get("id").in(activityIds);
    }

    private static Specification<Entry> projectIn(List<Long> projectIds) {

        return (root, query, cb) -> {

            Join<Entry, Activity> activity = root.join("activity", JoinType.INNER);

            return activity
                    .join("project", JoinType.INNER)
                    .get("id")
                    .in(projectIds);
        };
    }

    private static Specification<Entry> sprintIn(List<Long> sprintIds) {

        return (root, query, cb) -> {

            Join<Entry, SprintActivity> sprintActivity =
                    root.join("sprintActivity", JoinType.INNER);

            return sprintActivity
                    .join("sprint", JoinType.INNER)
                    .get("id")
                    .in(sprintIds);
        };
    }

    private static Specification<Entry> activityTypeIn(List<Long> activityTypeIds) {

        return (root, query, cb) ->
                root.join("activity", JoinType.INNER)
                        .join("activityType", JoinType.INNER)
                        .get("id")
                        .in(activityTypeIds);
    }

    private static Specification<Entry> categoryIn(
            List<Long> categoryIds) {

        return (root, query, cb) ->
                root.join("activity", JoinType.INNER)
                        .join("activityType", JoinType.INNER)
                        .join("category", JoinType.INNER)
                        .get("id")
                        .in(categoryIds);
    }

    private static Specification<Entry> statusIn(List<Long> statusIds) {

        return (root, query, cb) ->
                root.get("status")
                        .get("id")
                        .in(statusIds);
    }

    private static boolean hasValues(List<?> values) {
        return values != null && !values.isEmpty();
    }
}
