import React, { ChangeEvent, useCallback, useState } from 'react';

import { EmptySearchResult, HorizontalGroup, Input, Modal, VerticalGroup, Tag } from '@grafana/ui';
import cn from 'classnames/bind';
import { observer } from 'mobx-react';

import Block from 'components/GBlock/Block';
import IntegrationLogo from 'components/IntegrationLogo/IntegrationLogo';
import Text from 'components/Text/Text';
import { AlertReceiveChannelOption } from 'models/alert_receive_channel/alert_receive_channel.types';
import { useStore } from 'state/useStore';

import styles from './CreateAlertReceiveChannelContainer.module.css';

const cx = cn.bind(styles);

interface CreateAlertReceiveChannelContainerProps {
  onHide: () => void;
  onCreate: (option: AlertReceiveChannelOption) => void;
}

const CreateAlertReceiveChannelContainer = observer((props: CreateAlertReceiveChannelContainerProps) => {
  const { onHide, onCreate } = props;

  const { alertReceiveChannelStore } = useStore();

  const [filterValue, setFilterValue] = useState('');

  const handleCreateNewIntegrationClickCallback = useCallback(
    (option: AlertReceiveChannelOption) => {
      onHide();
      onCreate(option);
    },
    [onCreate, onHide]
  );

  const handleChangeFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.currentTarget.value);
  }, []);

  const { alertReceiveChannelOptions } = alertReceiveChannelStore;

  const options = alertReceiveChannelOptions
    ? alertReceiveChannelOptions.filter((option: AlertReceiveChannelOption) =>
        option.display_name.toLowerCase().includes(filterValue.toLowerCase())
      )
    : [];

  return (
    <Modal
      title={
        <HorizontalGroup className={cx('title')}>
          <Text.Title level={4}> Create Integration</Text.Title>
        </HorizontalGroup>
      }
      isOpen
      closeOnEscape={false}
      onDismiss={onHide}
      className={cx('modal')}
    >
      <div className={cx('search-integration')}>
        <Input autoFocus value={filterValue} placeholder="Search integrations ..." onChange={handleChangeFilter} />
      </div>
      <div className={cx('cards', { cards_centered: !options.length })} data-testid="create-integration-modal">
        {options.length ? (
          options.map((alertReceiveChannelChoice) => {
            return (
              <Block
                bordered
                shadowed
                onClick={() => {
                  handleCreateNewIntegrationClickCallback(alertReceiveChannelChoice);
                }}
                key={alertReceiveChannelChoice.value}
                className={cx('card', { card_featured: alertReceiveChannelChoice.featured })}
              >
                <div className={cx('card-bg')}>
                  <IntegrationLogo integration={alertReceiveChannelChoice} scale={0.2} />
                </div>
                <div className={cx('title')}>
                  <VerticalGroup spacing="none">
                    <Text strong>{alertReceiveChannelChoice.display_name}</Text>
                    <Text type="secondary" size="small">
                      {alertReceiveChannelChoice.short_description}
                    </Text>
                  </VerticalGroup>
                </div>
                {alertReceiveChannelChoice.featured && (
                  <Tag name="Quick connect" className={cx('tag')} colorIndex={7} />
                )}
              </Block>
            );
          })
        ) : (
          <EmptySearchResult>Could not find anything matching your query</EmptySearchResult>
        )}
      </div>
    </Modal>
  );
});

export default CreateAlertReceiveChannelContainer;
