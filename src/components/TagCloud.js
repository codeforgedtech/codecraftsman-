import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Importera din Supabase-klient
import '../styles/TagCloud.css'; // Importera CSS-stilar

const TagCloud = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching tags:', error.message);
      } else {
        setTags(data);
      }
      setLoading(false);
    };

    fetchTags();
  }, []);

  if (loading) {
    return <div className="tag-cloud loading">Loading...</div>;
  }

  return (
    <div className="tag-cloud">
      {tags.length > 0 ? (
        tags.map(tag => (
          <a href={`/tag/${tag.name}`} key={tag.id} className="tag">
            {tag.name}
          </a>
        ))
      ) : (
        <p>No tags available.</p>
      )}
    </div>
  );
};

export default TagCloud;