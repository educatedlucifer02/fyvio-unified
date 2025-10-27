import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button } from '@nextui-org/react';
import SEO from '../components/SEO';
import MoviesAndSeriesDetailsSections from '../components/MoviesAndSeriesDetailsSections';
import Similars from '../components/Similars';
import { BASE } from '../utils/constants';

const TvDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isWatchPopupOpen, setIsWatchPopupOpen] = useState(false);
  const [isWatchEpisodePopupOpen, setIsWatchEpisodePopupOpen] = useState(false);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsRes, similarRes] = await Promise.all([
          axios.get(`${BASE}/api/tv/${id}`),
          axios.get(`${BASE}/api/tv/${id}/similar`)
        ]);
        setDetails(detailsRes.data);
        setSimilar(similarRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get(`${BASE}/api/tv/${id}/season/${selectedSeason}`);
        const sortedSeasons = response.data.seasons.sort((a, b) => a.season_number - b.season_number);
        setSeasons(sortedSeasons);
        setEpisodes(response.data.episodes);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    };

    fetchEpisodes();
  }, [id, selectedSeason]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO title={`${details.name} - TV Series | Fyvio`} description={`Watch ${details.name} - ${details.overview}`} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="bg-zinc-900 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={details.poster_url || '/placeholder-poster.jpg'}
                    alt={details.name}
                    className="w-full md:w-48 rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-4">{details.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                      {details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}
                    </span>
                    <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                      {details.first_air_date}
                    </span>
                    <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                      {details.original_language?.toUpperCase()}
                    </span>
                    <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                      {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-3">{details.overview}</p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      color="primary" 
                      className="bg-red-600"
                      onClick={() => setIsWatchPopupOpen(true)}
                    >
                      Watch Now
                    </Button>
                    <Button 
                      variant="bordered" 
                      className="border-red-600 text-red-600"
                      onClick={() => setIsDownloadPopupOpen(true)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {seasons.length > 0 && (
              <Card className="bg-zinc-900 p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Episodes</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {seasons.map((season) => (
                    <Button
                      key={season.season_number}
                      variant={selectedSeason === season.season_number ? "solid" : "bordered"}
                      color="primary"
                      size="sm"
                      onClick={() => setSelectedSeason(season.season_number)}
                      className={selectedSeason === season.season_number ? "bg-red-600" : "border-red-600 text-red-600"}
                    >
                      Season {season.season_number}
                    </Button>
                  ))}
                </div>
                <div className="grid gap-4">
                  {episodes.map((episode) => (
                    <Card key={episode.id} className="bg-zinc-800 p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-gray-400 font-bold">
                          {episode.episode_number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{episode.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">{episode.overview}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
                              S{episode.season_number}E{episode.episode_number}
                            </span>
                            <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
                              {episode.air_date}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          color="primary"
                          className="bg-red-600"
                          onClick={() => {
                            setIsWatchEpisodePopupOpen(true);
                          }}
                        >
                          Watch
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>
          <div className="lg:col-span-1">
            <MoviesAndSeriesDetailsSections detailType="series" />
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-12">
            <Similars similar={similar} type="series" />
          </div>
        )}
      </div>

      {isWatchPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Choose Player</h2>
            <div className="space-y-2">
              <Button 
                color="primary" 
                className="w-full bg-red-600"
                onClick={() => {
                  // Handle MX Player selection
                  setIsWatchPopupOpen(false);
                }}
              >
                MX Player (Free)
              </Button>
              <Button 
                variant="bordered" 
                className="w-full border-red-600 text-red-600"
                onClick={() => {
                  // Handle VLC selection
                  setIsWatchPopupOpen(false);
                }}
              >
                VLC Player
              </Button>
            </div>
            <Button 
              className="w-full mt-4" 
              variant="light"
              onClick={() => setIsWatchPopupOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isWatchEpisodePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Choose Player</h2>
            <div className="space-y-2">
              <Button 
                color="primary" 
                className="w-full bg-red-600"
                onClick={() => {
                  // Handle MX Player selection for episode
                  setIsWatchEpisodePopupOpen(false);
                }}
              >
                MX Player (Free)
              </Button>
              <Button 
                variant="bordered" 
                className="w-full border-red-600 text-red-600"
                onClick={() => {
                  // Handle VLC selection for episode
                  setIsWatchEpisodePopupOpen(false);
                }}
              >
                VLC Player
              </Button>
            </div>
            <Button 
              className="w-full mt-4" 
              variant="light"
              onClick={() => setIsWatchEpisodePopupOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isDownloadPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Download Options</h2>
            <div className="space-y-2">
              <Button 
                color="primary" 
                className="w-full bg-red-600"
                onClick={() => {
                  // Handle download selection
                  setIsDownloadPopupOpen(false);
                }}
              >
                Download
              </Button>
            </div>
            <Button 
              className="w-full mt-4" 
              variant="light"
              onClick={() => setIsDownloadPopupOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TvDetails;