import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import classNames from 'classnames/bind';
import style from './VideoQueuePlayer.module.scss';
const cx = classNames.bind(style);
const VideoQueuePlayer = () => {
  return (
    <div className={cx('queue-player')}>
      <div className={cx('wrapper-queue')}>
        <div className={cx('queue-title')}>
          <h3>Danh Sách Phát</h3>
          <div className={cx('auto-play-switch')}>
            <span className={cx('auto-play-text')}>Tự động phát</span>
            <div className={cx('switch')}>switch</div>
          </div>
        </div>
        <div className={cx('menu')}>
          <Scrollbar
            wrapperProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <span {...restProps} ref={elementRef} style={{ inset: '0 0 10px 0' }} />;
              },
            }}
            trackYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '4px' }} />;
              },
            }}
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    className='tHuMbY'
                    style={{
                      width: '100%',
                      backgroundColor: 'hsla(0,0%,100%,0.3)',
                      zIndex: '50',
                      position: 'relative',
                      borderRadius: '5px',
                    }}
                  />
                );
              },
            }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, harum accusantium. Provident, sapiente vitae eveniet neque suscipit sequi
            repudiandae similique! Deleniti quibusdam aspernatur et vel! Repudiandae quam quibusdam rem pariatur? Facere enim repudiandae recusandae
            amet a perferendis repellendus vel vitae obcaecati saepe temporibus nobis asperiores suscipit in laboriosam iusto deleniti ducimus animi
            aliquid, odit quia facilis id earum dolore! Nobis. Deserunt veritatis natus sit nesciunt veniam eveniet incidunt, illo perspiciatis quos
            laboriosam iusto magnam amet repudiandae id repellendus modi necessitatibus eum aperiam. Rem mollitia numquam aliquam perspiciatis aliquid
            quam eum. Rerum sapiente assumenda maxime, eum qui sint rem illo animi neque ullam quis ipsam laudantium sequi dignissimos? Laudantium
            veniam accusantium mollitia inventore odio, aut incidunt totam doloribus tempore sequi excepturi. Asperiores iusto, atque explicabo qui
            consectetur quisquam eius assumenda doloribus necessitatibus quis labore sapiente! Distinctio quisquam, consectetur neque quas iste quis
            ratione aliquid nihil, sit itaque eum animi quibusdam reiciendis. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
            ducimus voluptatum quia vitae deserunt beatae dicta nesciunt quae. Ratione nisi iure officia sequi id asperiores consequuntur. Nemo nulla
            odit amet. Quae sequi aliquam corrupti nulla veritatis voluptatem earum debitis, ea in iusto cumque culpa maiores quibusdam ipsum?
            Aspernatur ducimus exercitationem illo culpa dolore. Dolor quae expedita nihil quibusdam totam voluptates. Voluptate perspiciatis
            perferendis quo ab tenetur quae. Quo qui molestiae corrupti eveniet delectus eius tempora cumque dolorem, officiis, odit explicabo
            veritatis ab at in aperiam saepe velit cupiditate fugiat voluptas? Totam aut, minus corrupti corporis ut perspiciatis quisquam quas, ex
            dolorum sunt iste nisi vel similique consequatur aperiam dolore nam pariatur, vero sequi repellat hic excepturi debitis molestias quae.
            Repellat? Quia sunt officia quae dicta nemo expedita quod explicabo ducimus illo laborum rem, molestias vel, laudantium magnam pariatur
            vitae id consectetur excepturi? Reiciendis et temporibus eos facere rem maiores officiis. Magnam quibusdam temporibus modi suscipit
            nesciunt alias voluptate debitis placeat, iste dicta ratione accusantium molestias fuga omnis beatae tempore obcaecati et perferendis enim
            odit! Earum sequi iure laudantium vitae ad. Eius sunt reprehenderit consectetur maxime eveniet totam? Accusantium ducimus eligendi
            laboriosam magnam aliquam reiciendis similique maxime! Facere omnis corrupti eos delectus alias dolor odit architecto fuga? Ducimus
            laborum dolor assumenda! Nisi maiores et corrupti alias dolor, quisquam ducimus accusamus eum sed similique aliquid nemo excepturi iusto
            magnam quibusdam ad deleniti voluptate beatae quidem blanditiis nostrum, architecto doloribus delectus! Sapiente, nihil! Quo nobis quaerat
            animi ad maiores, obcaecati dicta blanditiis, saepe id asperiores sunt aperiam dolor veniam ullam vel, quas iure optio hic illum suscipit
            minus! Ratione tempore fugiat doloremque dicta? Illum itaque est aliquam, harum id dolore quasi accusantium et iure corrupti quod vel aut
            numquam exercitationem obcaecati sequi dignissimos consequatur ipsam unde atque, architecto mollitia. Labore atque aspernatur cum!
          </Scrollbar>
        </div>
      </div>
    </div>
  );
};

export default VideoQueuePlayer;
