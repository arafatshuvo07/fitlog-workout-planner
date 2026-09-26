"use client";
import { ChevronDown, Search, X } from "lucide-react";
import type { SortKey } from "@/lib/workouts";
export function ListControls({
  query,
  onQueryChange,
  sort,
  onSortChange,
  id,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  id: string;
}) {
  return (
    <div className="list-controls">
      <div className="search-field">
        <Search aria-hidden="true" />
        <label className="sr-only" htmlFor={`${id}-search`}>
          Search workouts by name or muscle group
        </label>
        <input
          id={`${id}-search`}
          type="search"
          placeholder="Search workouts…"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <button aria-label="Clear search" onClick={() => onQueryChange("")}>
            <X />
          </button>
        )}
      </div>
      <div className="sort-field">
        <label htmlFor={`${id}-sort`}>Sort By</label>
        <div className="select-wrap">
          <select
            id={`${id}-sort`}
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
          >
            <option value="duration">Duration</option>
            <option value="caloriesBurned">Calories</option>
            <option value="rating">Rating</option>
          </select>
          <ChevronDown aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
