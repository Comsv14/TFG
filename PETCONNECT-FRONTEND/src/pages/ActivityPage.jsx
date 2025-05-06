import { useEffect, useState } from 'react';
import activityApi from '../services/activityApi';
import StarRater from '../components/StarRater';
import { Card, CardContent } from '@/components/ui/card';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);

  /* --------- Carga inicial ----------------------------------------- */
  useEffect(() => {
    load();
  }, []);

  async function load() {
    const list = await activityApi.list();
    setActivities(list);
  }

  const active   = activities.filter(a => !a.is_finished);
  const finished = activities.filter(a =>  a.is_finished);

  /* --------- Render ------------------------------------------------- */
  return (
    <div className="container mx-auto p-4 space-y-10">
      {/* ACTIVAS ------------------------------------------------------ */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Próximas / Activas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {active.map(act => (
            <Card key={act.id} className="flex flex-col">
              <CardContent className="p-4 space-y-2 flex-1">
                <h3 className="text-xl font-medium">{act.title}</h3>
                <p className="text-sm">{act.description}</p>
                <p className="text-sm italic">
                  {new Date(act.starts_at).toLocaleString()} &mdash;{' '}
                  {new Date(act.ends_at).toLocaleString()}
                </p>

                <p className="text-sm">
                  Asistentes: <strong>{act.participants_count}</strong>
                </p>

                <div className="mt-auto">
                  <StarRater
                    value={act.average_rating}
                    disabled={!act.is_finished}
                    onRate={rating => activityApi.rate(act.id, rating).then(load)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FINALIZADAS -------------------------------------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Finalizadas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {finished.map(act => (
            <Card key={act.id}>
              <CardContent className="p-4 space-y-2">
                <h3 className="text-xl font-medium">{act.title}</h3>
                <p className="text-sm">{act.description}</p>

                <p className="text-sm">
                  Participantes: <strong>{act.participants_count}</strong>
                </p>

                <StarRater value={act.average_rating} readOnly />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
