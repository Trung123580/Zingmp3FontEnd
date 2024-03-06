import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './LibraryMusic.module.scss';
import { useContext } from 'react';
import { AuthProvider } from '~/AuthProvider';
import TitlePage from '~/utils/TitlePage';
import { useSelector } from 'react-redux';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { CardArtists } from '~/components';
import path from '~/router/path';
import LibraryMusicArtists from '~/components/LibraryMusicArtists';
const cx = classNames.bind(style);
const LibraryMusic = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onRemoveArtist, onAddArtist, onPlaySong } = handle;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRouterArtist = pathname.includes('artist');
  console.log(currentUser);
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };

  if (!currentUser) {
    return (
      <section className={cx('container')}>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={4} height={200} />
      </section>
    );
  }

  if (isRouterArtist) {
    return (
      <LibraryMusicArtists
        currentUser={currentUser}
        onRemoveArtist={onRemoveArtist}
        onAddArtist={onAddArtist}
        themeApp={themeApp}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <section className={cx('container')}>
      <div className={cx('library__music')}>
        <TitlePage
          content='thư viện'
          onClick={() =>
            onPlaySong(
              currentUser?.loveMusic[Math.floor(Math.random() * currentUser?.loveMusic.length)],
              currentUser?.loveMusic || [],
              'Nhạc yêu thích'
            )
          }
        />
        <div className={cx('menu__artists')}>
          {currentUser?.followArtist.map((artist, index) => {
            if (index < 5) {
              return (
                <CardArtists
                  key={artist.id}
                  data={artist}
                  isHiddenFollow={true}
                  // onToggleArtist={(e) => {
                  //   currentUser?.followArtist.some((item) => item.id === artist.id) ? onRemoveArtist(e, artist.id) : onAddArtist(e, artist);
                  // }}
                  // isFollowArtist={currentUser?.followArtist.some((item) => item.id === artist.id)}
                  themeApp={themeApp}
                  onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', artist.link))}
                />
              );
            }
            return null;
          })}
          <CardArtists navigateFollow themeApp={themeApp} onNavigate={() => handleNavigate(`${path.LIBRARY_MUSIC}/${path.ARTISTS}`)} />
        </div>
      </div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque doloribus ea tenetur distinctio dolores ducimus quae! Sapiente incidunt, magni
      optio esse reprehenderit vel, numquam accusantium fuga, consequuntur rerum recusandae excepturi! Nulla natus ducimus quod autem, eaque veritatis
      consequuntur in aliquid similique officia quidem? Aliquid nam sit repudiandae minus, numquam laboriosam praesentium, deserunt corporis
      consequatur doloremque quos, quis adipisci molestiae. Accusamus. Facere ipsam, perspiciatis commodi animi architecto ipsum. Sed expedita
      molestias quod aspernatur quasi, dicta iusto inventore ad iste, impedit corporis nostrum nesciunt voluptatibus atque praesentium sequi. Rem
      vitae eligendi amet! Eveniet a nostrum amet debitis unde sed, nesciunt mollitia eum alias laboriosam officiis sint? Nisi impedit iusto atque,
      tenetur architecto iste doloribus, similique eum deserunt tempore debitis culpa nesciunt eaque? Repellendus, libero eius incidunt dolore error
      impedit nostrum sit repudiandae voluptas velit ex, consequatur, porro tempore. Alias illum veniam explicabo! Aliquam tempore natus ut optio
      praesentium eum molestias, soluta eos! Ducimus autem ratione odit esse repellat eaque in vel enim libero voluptate, sed magnam ad explicabo iste
      quia laborum est mollitia optio numquam. Esse quibusdam voluptatibus aliquid, illo veniam iure? Excepturi libero ipsum ut id iusto, eligendi
      odio dicta sequi iste accusantium voluptatibus deserunt? Possimus veritatis laboriosam consequatur eos aperiam aut error natus praesentium quis
      fugiat? Itaque iste magni dolor. Blanditiis nihil ad corporis voluptas repellat fugiat ex, officiis a, quasi architecto error possimus cum!
      Dolorum inventore reprehenderit error minima qui, dolor doloremque fugiat illo molestiae ipsam, culpa corporis explicabo! Dolore ut, nostrum
      atque corrupti aut iure, quam doloremque architecto provident ad rem voluptas est velit perferendis perspiciatis quas quibusdam aliquid
      cupiditate doloribus necessitatibus, error a dignissimos. Possimus, totam dolorum! Quod iure magni dolore repudiandae, odio natus expedita rerum
      ea eius, a alias accusantium ducimus veritatis architecto sapiente laborum ratione, error minima aspernatur suscipit! Est quas veniam neque rem
      reprehenderit.
      <Outlet />
    </section>
  );
};

export default LibraryMusic;
