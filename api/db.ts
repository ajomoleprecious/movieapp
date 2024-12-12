import axios from 'axios';

const read_config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_API_READ_ACCESS_TOKEN}`
    },
};

export const image500 = (path: string): string | null => path ? `https://image.tmdb.org/t/p/original/${path}` : null;
export const image342 = (path: string): string | null => path ? `https://image.tmdb.org/t/p/w342/${path}` : null;
export const image185 = (path: string): string | null => path ? `https://image.tmdb.org/t/p/w185/${path}` : null;
export const fallbackMovieImage = require("../assets/images/fallbackmovie.png");
export const fallbackpersonImage = require("../assets/images/fallbackperson.png");

export const getTrendingMovies = async () => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?language=en-US`, read_config);
        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching trending movies:", error.message);
        } else {
            console.error("Error fetching trending movies:", error);
        }
        throw error;
    }
}


export const getUpcomingMovies = async () => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching upcoming movies:", error.message);
        } else {
            console.error("Error fetching upcoming movies:", error);
        }
        throw error;
    }
};

export const getTopRatedMovies = async () => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching top rated movies:", error.message);
        } else {
            console.error("Error fetching top rated movies:", error);
        }
        throw error;
    }
};

export const getMovieDetails = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?append_to_response=similar%2Ccredits%2Cimages%2Cvideos&language=en-US`, read_config);

        if (response.data) {
            return response.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching movie details:", error.message);
        } else {
            console.error("Error fetching movie details:", error);
        }
        throw error;
    }
};

export const getPersonDetails = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/person/${id}?language=en-US`, read_config);

        if (response.data) {
            return response.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching person details:", error.message);
        } else {
            console.error("Error fetching person details:", error);
        }
        throw error;
    }
};

export const getPersonMovieCredits = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`, read_config);

        if (response.data) {
            return response.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching person movie credits:", error.message);
        } else {
            console.error("Error fetching person movie credits:", error);
        }
        throw error;
    }
}

export const getPersonTvCredits = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/person/${id}/tv_credits?language=en-US`, read_config);

        if (response.data) {
            return response.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching person tv credits:", error.message);
        } else {
            console.error("Error fetching person tv credits:", error);
        }
        throw error;
    }
}

export const searchMovies = async (query: string) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error searching movies:", error.message);
        } else {
            console.error("Error searching movies:", error);
        }
        throw error;
    }
}

export const searchTvShows = async (query: string) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${query}&language=en-US&page=1`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error searching tv shows:", error.message);
        } else {
            console.error("Error searching tv shows:", error);
        }
        throw error;
    }
}

export const searchPeople = async (query: string) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/person?query=${query}&language=en-US&page=1`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error searching people:", error.message);
        } else {
            console.error("Error searching people:", error);
        }
        throw error;
    }
}


export const getMovieVideos = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching movie videos:", error.message);
        } else {
            console.error("Error fetching movie videos:", error);
        }
        throw error;
    }
}

export const getUpcomingMoviesPage = async (page: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching upcoming movies:", error.message);
        } else {
            console.error("Error fetching upcoming movies:", error);
        }
        throw error;
    }
}

export const getTopRatedMoviesPage = async (page: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching upcoming movies:", error.message);
        } else {
            console.error("Error fetching upcoming movies:", error);
        }
        throw error;
    }
}

export const getTrendingTvShows = async () => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/tv/week?language=en-US`, read_config);
        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching popular tv shows:", error.message);
        } else {
            console.error("Error fetching popular tv shows:", error);
        }
        throw error;
    }
}

export const getOnAirTvShows = async () => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1`, read_config);
        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching popular tv shows:", error.message);
        } else {
            console.error("Error fetching popular tv shows:", error);
        }
        throw error;
    }
}

export const getOnAirTvShowsPage = async (page: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=${page}`, read_config);
        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching popular tv shows:", error.message);
        } else {
            console.error("Error fetching popular tv shows:", error);
        }
        throw error;
    }
}

export const getTopRatedTvShows = async () => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1`, read_config);
        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching popular tv shows:", error.message);
        } else {
            console.error("Error fetching popular tv shows:", error);
        }
        throw error;
    }
}

export const getTopRatedTvShowsPage = async (page: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${page}`, read_config);
        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching popular tv shows:", error.message);
        } else {
            console.error("Error fetching popular tv shows:", error);
        }
        throw error;
    }
}

export const getMovieImages = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/images`, read_config);

        if (response.data && response.data.backdrops) {
            return response.data.backdrops.map((image: { file_path: string; }) => image500(image.file_path));
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching movie images:", error.message);
        } else {
            console.error("Error fetching movie images:", error);
        }
        throw error;
    }
}

// post a review

// export const postReview = async (id: number, review: string, rating: number) => {
//     try {
//         const response = await axios.post(`https://api.themoviedb.org/3/movie/${id}/rating?language=en-US`, {
//             value: rating,
//             review: review
//         }, read_config);

//         if (response.data) {
//             return response.data;
//         } else {
//             throw new Error("Invalid response structure");
//         }
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error("Error posting review:", error.message);
//         } else {
//             console.error("Error posting review:", error);
//         }
//         throw error;
//     }
// }


export const getCollectionDetails = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/collection/${id}?language=en-US`, read_config);

        if (response.data) {
            return response.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching collection details:", error.message);
        } else {
            console.error("Error fetching collection details:", error);
        }
        throw error;
    }
}

export const getMovieReviews = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching movie reviews:", error.message);
        } else {
            console.error("Error fetching movie reviews:", error);
        }
        throw error;
    }
}

export const getTvShowDetails = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, read_config);

        if (response.data) {
            return response.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching tv show details:", error.message);
        } else {
            console.error("Error fetching tv show details:", error);
        }
        throw error;
    }
}

export const getTvSeasonDetails = async (id: number, season_number: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${season_number}?language=en-US`, read_config);

        if (response.data) {
            return response.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching tv season details:", error.message);
        } else {
            console.error("Error fetching tv season details:", error);
        }
        throw error;
    }
}

export const getTvSeasonCredits = async (id: number, season_number: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${season_number}/credits?language=en-US`, read_config);

        if (response.data) {
            return response.data;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching tv season credits:", error.message);
        } else {
            console.error("Error fetching tv season credits:", error);
        }
        throw error;
    }
}

export const getTvShowReviews = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US&page=1`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching tv show reviews:", error.message);
        } else {
            console.error("Error fetching tv show reviews:", error);
        }
        throw error;
    }
}

export const getSimilarTvShows = async (id: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching similar tv shows:", error.message);
        } else {
            console.error("Error fetching similar tv shows:", error);
        }
        throw error;
    }
}

export const getTvShowImages = async (id: number, season_number: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${season_number}/images`, read_config);

        if (response.data && response.data.posters) {
            return response.data.posters.map((image: { file_path: string; }) => image500(image.file_path));
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching tv show images:", error.message);
        } else {
            console.error("Error fetching tv show images:", error);
        }
        throw error;
    }
}

export const getTvShowVideos = async (id: number, season_number: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${season_number}/videos`, read_config);

        if (response.data && response.data.results) {
            return response.data.results;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching tv show videos:", error.message);
        } else {
            console.error("Error fetching tv show videos:", error);
        }
        throw error;
    }
}