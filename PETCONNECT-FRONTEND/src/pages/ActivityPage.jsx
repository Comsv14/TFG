import { useEffect, useState } from 'react';
import activityApi from '../services/activityApi';
import StarRater from '../components/StarRater';
import { Card, CardContent } from '@/components/ui/card';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const list = await activityApi.list();
    setActivities(list);
  }

  const handleRate = async (activityId, rating) => {
    await activityApi.rate(activityId, rating);
    setActivities(prevActivities =>
      prevActivities.map(act =>
        act.id === activityId
          ? { ...act, average_rating: rating }
          : act
      )
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-10">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Próximas / Activas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {activities.map(act => (
            <Card key={act.id} className="flex flex-col">
              <CardContent className="p-4 space-y-2 flex-1">
                <h3 className="text-xl font-medium">{act.title}</h3>
                <p>{act.description}</p>
                <p className="text-sm italic">
                  {new Date(act.starts_at).toLocaleString()} &mdash;{' '}
                  {new Date(act.ends_at).toLocaleString()}
                </p>
                <p className="text-sm">
                  Asistentes: <strong>{act.participants_count}</strong>
                </p>
                <StarRater
                  value={act.average_rating}
                  readOnly={!act.is_finished}
                  onRate={(rating) => handleRate(act.id, rating)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
