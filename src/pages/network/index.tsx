import React, { useState } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { User, UserRole } from '@/types';
import { mockUsers } from '@/data/users';
import EmptyState from '@/components/EmptyState';

type CityFilter = 'all' | string;
type ProfessionFilter = 'all' | UserRole;

const NetworkPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [cityFilter, setCityFilter] = useState<CityFilter>('all');
  const [professionFilter, setProfessionFilter] = useState<ProfessionFilter>('all');
  const [acceptOnly, setAcceptOnly] = useState(false);

  const cities = ['all', '上海', '北京', '广州', '成都', '深圳', '杭州', '武汉', '南京', '重庆', '西安'];
  const professions: { key: ProfessionFilter; label: string }[] = [
    { key: 'all', label: '全部职业' },
    { key: 'pet-funerary', label: '宠物殡葬师' },
    { key: 'body-groomer', label: '遗体整理师' },
    { key: 'other', label: '其他' }
  ];

  const filteredUsers = mockUsers.filter(u => {
    if (searchText) {
      const search = searchText.toLowerCase();
      if (!u.nickname.toLowerCase().includes(search) &&
          !u.profession.toLowerCase().includes(search)) {
        return false;
      }
    }
    if (cityFilter !== 'all' && u.city !== cityFilter) return false;
    if (professionFilter !== 'all' && u.professionId !== professionFilter) return false;
    if (acceptOnly && !u.acceptOrder) return false;
    return true;
  });

  const handleContact = (user: User) => {
    console.log('[Network] Contact user:', user.id);
    Taro.showToast({ title: '私信功能开发中', icon: 'none' });
  };

  const viewProfile = (user: User) => {
    console.log('[Network] View profile:', user.id);
    Taro.navigateTo({ url: '/pages/profile/index' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder="搜索同行姓名、职业..."
          value={searchText}
          onInput={(e) => setSearchText(e.detail.value)}
        />
      </View>

      <View className={styles.filterSection}>
        <Text className={styles.sectionTitle}>所在城市</Text>
        <View className={styles.filterScroll}>
          {cities.map(city => (
            <View
              key={city}
              className={classnames(styles.filterChip, cityFilter === city && styles.filterActive)}
              onClick={() => setCityFilter(city)}
            >
              <Text>{city === 'all' ? '全部' : city}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.filterSection}>
        <Text className={styles.sectionTitle}>职业类型</Text>
        <View className={styles.filterScroll}>
          {professions.map(prof => (
            <View
              key={prof.key}
              className={classnames(styles.filterChip, professionFilter === prof.key && styles.filterActive)}
              onClick={() => setProfessionFilter(prof.key)}
            >
              <Text>{prof.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.toggleRow}>
        <Text className={styles.toggleLabel}>只看可接单</Text>
        <View
          className={classnames(styles.toggleBtn, acceptOnly && styles.toggleActive)}
          onClick={() => setAcceptOnly(!acceptOnly)}
        />
      </View>

      {filteredUsers.length === 0 ? (
        <EmptyState title="暂无匹配的同行" description="调整筛选条件试试看吧~" />
      ) : (
        <View className={styles.userGrid}>
          {filteredUsers.map(u => (
            <View key={u.id} className={styles.userCard}>
              <View className={styles.userHeader}>
                <View className={styles.avatar}>
                  <Image
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    src={u.avatar}
                    mode="aspectFill"
                  />
                  {u.verified && (
                    <View className={styles.verifiedBadge}>
                      <Text>✓</Text>
                    </View>
                  )}
                </View>
                <View className={styles.userInfo}>
                  <View className={styles.userNameRow}>
                    <Text className={styles.userName}>
                      {u.anonymity === 'full-anonymous' ? '匿名同行' : u.nickname}
                    </Text>
                    {u.acceptOrder && (
                      <View className={styles.acceptBadge}>
                        <Text>● 可接单</Text>
                      </View>
                    )}
                  </View>
                  <Text className={styles.userProfession}>{u.profession}</Text>
                  <View className={styles.userMeta}>
                    <Text>📍 {u.city}</Text>
                    <Text>🕐 {u.yearsExperience > 0 ? `从业${u.yearsExperience}年` : '新手入行'}</Text>
                    <Text>⭐ {u.creditScore}分</Text>
                  </View>
                </View>
              </View>

              {u.bio && (
                <View className={styles.bioText}>
                  <Text>"{u.bio}"</Text>
                </View>
              )}

              <View className={styles.skillsRow}>
                {u.skills.map((skill, idx) => (
                  <View key={idx} className={styles.skillTag}>
                    <Text>{skill}</Text>
                  </View>
                ))}
              </View>

              {u.feeRange && (
                <View className={styles.feeRow}>
                  <Text className={styles.feeLabel}>收费区间参考</Text>
                  <Text className={styles.feeValue}>
                    ¥{u.feeRange.min.toLocaleString()} - ¥{u.feeRange.max.toLocaleString()} {u.feeRange.unit}
                  </Text>
                </View>
              )}

              <View className={styles.actionRow}>
                <View
                  className={classnames(styles.actionBtn, styles.btnSecondary)}
                  onClick={() => viewProfile(u)}
                >
                  <Text>查看档案</Text>
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.btnPrimary)}
                  onClick={() => handleContact(u)}
                >
                  <Text>私信联系</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default NetworkPage;
