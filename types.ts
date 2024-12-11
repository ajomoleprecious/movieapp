// General Movie Types
export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: Date;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

export type MovieImage = {
    aspect_ratio: number;
    height: number;
    iso_639_1: null | string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
};

// MovieDetail Types
export type Genre = {
    id: number;
    name: string;
};

export type ProductionCompany = {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
};

export type ProductionCountry = {
    iso_3166_1: string;
    name: string;
};

export type SpokenLanguage = {
    english_name: string;
    iso_639_1: string;
    name: string;
};

export type MovieDetail = {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: string | null;
    budget: number;
    genres: Genre[];
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    release_date: string | null;
    revenue: number;
    runtime: number | null;
    spoken_languages: SpokenLanguage[];
    status: string | null;
    tagline: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

// Credit Types
export type CastMember = {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
};

export type CrewMember = {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    credit_id: string;
    department: string;
    job: string;
};

export type Credit = {
    id: number;
    cast: CastMember[];
    crew: CrewMember[];
};

export type Actor = {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: string | null;
    deathday: string | null;
    gender: number;
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    known_for_department: string;
    name: string;
    place_of_birth: string | null;
    popularity: number;
    profile_path: string | null;
    movie_credits: MovieCredit;
};

export type CastMovie = Movie & {
    credit_id: string;
    order: number;
    media_type: string;
};

export type CrewMovie = {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    credit_id: string;
    department: string;
    job: string;
    media_type: string;
};

export type MovieCredit = {
    cast: CastMovie[];
    crew: CrewMovie[];
};

export type ActorPlays = MovieCredit & {
    id: number;
};

export type Serie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    first_air_date: string;
    name: string;
    vote_average: number;
    vote_count: number;
}

export type Review = {
    author:        string;
    author_details: AuthorDetails;
    content:       string;
    created_at:    Date;
    id:            string;
    updated_at:    Date;
    url:           string;
}

export type AuthorDetails = {
    name:       string;
    username:   string;
    avatar_path: string;
    rating:     number;
}

export type SerieDetail = {
    adult:               boolean;
    backdrop_path:       string;
    created_by:          CreatedBy[];
    episode_run_time:    number[];
    first_air_date:      Date;
    genres:              Genre[];
    homepage:            string;
    id:                  number;
    in_production:       boolean;
    languages:           string[];
    last_air_date:       Date;
    last_episode_to_air: LastEpisodeToAir;
    name:                string;
    next_episode_to_air: null;
    networks:            Network[];
    number_of_episodes:  number;
    number_of_seasons:   number;
    origin_country:      string[];
    original_language:   string;
    original_name:       string;
    overview:            string;
    popularity:          number;
    poster_path:         string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    seasons:             Season[];
    spoken_languages:    SpokenLanguage[];
    status:              string;
    tagline:             string;
    type:                string;
    vote_average:        number;
    vote_count:          number;
}

export type CreatedBy = {
    id:          number;
    credit_id:   string;
    name:        string;
    gender:      number;
    profile_path: string;
}


export type LastEpisodeToAir = {
    id:             number;
    name:           string;
    overview:       string;
    vote_average:   number;
    vote_count:     number;
    air_date:       Date;
    episode_number: number;
    production_code: string;
    runtime:        number;
    season_number:  number;
    show_id:        number;
    still_path:     string;
}

export type Network = {
    id:            number;
    logo_path:     string;
    name:          string;
    origin_country: string;
}


export type Season = {
    air_date:     Date;
    episode_count: number;
    id:           number;
    name:         string;
    overview:     string;
    poster_path:  string;
    season_number: number;
    vote_average: number;
}

export type TvSerieDetail = {
    id:             string;
    air_date:       Date;
    episodes:       Episode[];
    name:           string;
    overview:       string;
    popular_movie_id: number;
    poster_path:    string;
    season_number:  number;
    vote_average:   number;
}

export type Episode = {
    air_date:       Date;
    episode_number: number;
    episode_type:   string;
    id:             number;
    name:           string;
    overview:       string;
    production_code: string;
    runtime:        number;
    season_number:  number;
    show_id:        number;
    still_path:     string;
    vote_average:   number;
    vote_count:     number;
    crew:           Crew[];
    guest_stars:    Crew[];
}

export type Crew = {
    job?:               string;
    department?:        string;
    credit_id:          string;
    adult:              boolean;
    gender:             number;
    id:                 number;
    known_for_department: string;
    name:               string;
    original_name:      string;
    popularity:         number;
    profile_path:       string;
    character?:         string;
    order?:             number;
}
