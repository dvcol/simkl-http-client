/**
 * @see [sync-activity]{https://simkl.docs.apiary.io/reference/sync/last-activities/get-last-activity}
 */
export type SimklActivityCategory = {
  /** Latest update time within the category, use it as first check. */
  all: string;
  /**
   * If updated check the Get Ratings endpoint with date_from parameter to get latest rating updates/deletes.
   *
   * **Caution:**
   * - When the user rated a movie it will be automoved to "Completed", but completed_at activity field date won't be updated.
   * - You should use /sync/ratings endpoint with date_from and get those "Completed" items from there(it has all data).
   * - Update ratings and statuses(completed,watching) in your app.
   */
  rated_at: string;
  /**
   * Items were added to one of the lists (exc. ratings automove function which won't update this fields) or some episodes were marked/unmarked.
   * If updated check the Get All Items endpoint with date_from and extended parameters.
   **/
  plantowatch: string /**
   * Items were added to one of the lists (exc. ratings automove function which won't update this fields) or some episodes were marked/unmarked.
   * If updated check the Get All Items endpoint with date_from and extended parameters.
   **/;
  watching: string /**
   * Items were added to one of the lists (exc. ratings automove function which won't update this fields) or some episodes were marked/unmarked.
   * If updated check the Get All Items endpoint with date_from and extended parameters.
   **/;
  completed: string /**
   * Items were added to one of the lists (exc. ratings automove function which won't update this fields) or some episodes were marked/unmarked.
   * If updated check the Get All Items endpoint with date_from and extended parameters.
   **/;
  hold: string /**
   * Items were added to one of the lists (exc. ratings automove function which won't update this fields) or some episodes were marked/unmarked.
   * If updated check the Get All Items endpoint with date_from and extended parameters.
   **/;
  dropped: string;
  /**
   * Check the Get All Items endpoint without date_from and extended parameters to determine which items were removed.
   * If removed items from the lists had ratings, they would be removed.
   */
  removed_from_list: string;
};

/**
 * @see [sync-activity]{https://simkl.docs.apiary.io/reference/sync/last-activities/get-last-activity}
 */
export type SimklActivity = {
  /** Latest update time within the category, use it as first check. */
  all: string;
  /** Any update in [simkl's settings page]{@link https://simkl.com/settings/} will trigger update time. For example when user changes his name or time zone. */
  settings: SimklActivityCategory;
  anime: SimklActivityCategory;
  movies: Omit<SimklActivityCategory, 'watching' | 'hold'>;
};
