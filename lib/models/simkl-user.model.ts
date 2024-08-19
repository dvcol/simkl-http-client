export type SimklUserLastArt = {
  id: number;
  url: string;
  title: string;
  poster: string;
  fanart: string;
};

export type SimklUserLastArtRequest = {
  /** Simkl user id which has public privacy settings. */
  id: number;
};

export type SimklUserLastArtRedirectRequest = SimklUserLastArtRequest & {
  /** Must be "poster" or "fanart" */
  image: 'poster' | 'fanart';
  /** The client ID you received from Simkl when you registered your application. */
  client_id?: string;
};

export type SimklUser = {
  name: string;
  joined_at: string;
  gender: string;
  avatar: string;
  bio: string;
  loc: string;
  age: string;
};

export type SimklUserAccount = {
  id: number;
  timezone: string;
  type: string;
};

export type SimklUserConnection = {
  facebook: string;
};

export type SimklUserSettings = {
  user: SimklUser;
  account: SimklUserAccount;
  connections: SimklUserConnection;
};

export type SimklUserStat = {
  mins: number;
  count: number;
};
export type SimklUserMovieStats = {
  total_mins: number;
  plantowatch: SimklUserStat;
  notinteresting: SimklUserStat;
  completed: SimklUserStat;
};

export type SimklUserShowOrAnimeStats = {
  total_mins: number;
  watching: {
    watched_episodes_count: number;
    count: number;
    left_to_watch_episodes: number;
    left_to_watch_mins: number;
    total_episodes_count: number;
  };
  hold: {
    watched_episodes_count: number;
    count: number;
    left_to_watch_episodes: number;
    left_to_watch_mins: number;
    total_episodes_count: number;
  };
  plantowatch: {
    watched_episodes_count: number;
    count: number;
    left_to_watch_episodes: number;
    left_to_watch_mins: number;
    total_episodes_count: number;
  };
  notinteresting: {
    watched_episodes_count: number;
    count: number;
  };
  completed: {
    watched_episodes_count: number;
    count: number;
  };
};

export type SimklUserStats = {
  total_mins: number;
  movies: SimklUserMovieStats;
  tv: SimklUserShowOrAnimeStats;
  anime: SimklUserShowOrAnimeStats;
  watched_last_week: {
    total_mins: number;
    movies_mins: number;
    tv_mins: number;
    anime_mins: number;
  };
};

export type SimklUserStatsRequest = {
  /** Simkl user id. */
  id: number;
};
