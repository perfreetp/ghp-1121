import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { currentUser } from '@/data/users';

const careerPath = [
  {
    period: '2021年 - 至今',
    title: '宠物殡葬师 · 独立执业',
    desc: '独立承接各类宠物善终服务，累计完成服务500+单，客户好评率98%。专注于个性化告别仪式策划。'
  },
  {
    period: '2019年 - 2021年',
    title: '某宠物善终服务中心 · 资深服务师',
    desc: '负责大型宠物的告别仪式及火化操作，处理过各类复杂情况，培训新员工10余人。'
  },
  {
    period: '2018年 - 2019年',
    title: '宠物善终服务 · 初级学徒',
    desc: '跟随行业前辈系统学习宠物殡葬全流程，考取宠物殡葬服务师职业资格证书。'
  }
];

const tools = [
  { icon: '🧰', name: '宠物火化炉', brand: 'X牌专业级', usage: '每日使用' },
  { icon: '🧴', name: '宠物专用清洁套装', brand: '医用级无香型', usage: '每次服务' },
  { icon: '🖌', name: '专业整理工具组', brand: '定制款12件套', usage: '每次服务' },
  { icon: '💡', name: '便携式LED灯组', brand: '柔光护眼款', usage: '常用' }
];

const services = [
  { name: '基础火化服务', fee: '¥800 起' },
  { name: '完整告别仪式', fee: '¥2,000 起' },
  { name: '宠物骨灰寄存', fee: '¥365/年' },
  { name: '纪念品定制服务', fee: '¥500 - ¥3,000' },
  { name: '上门接运服务', fee: '¥200 起' }
];

const ProfilePage: React.FC = () => {
  const handleEdit = (section: string) => {
    console.log('[Profile] Edit section:', section);
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' });
  };

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.card}>
        <View className={styles.basicRow}>
          <View className={styles.avatarWrapper}>
            <Image className={styles.avatar} src={currentUser.avatar} mode="aspectFill" />
            {currentUser.verified && (
              <View className={styles.verifiedBadge}>
                <Text>✓</Text>
              </View>
            )}
          </View>
          <View className={styles.basicInfo}>
            <View className={styles.nameRow}>
              <Text className={styles.userName}>
                {currentUser.anonymity === 'full-anonymous' ? '匿名同行' : currentUser.nickname}
              </Text>
              <View className={styles.professionBadge}>
                <Text>{currentUser.profession}</Text>
              </View>
            </View>
            <Text className={styles.userMeta}>
              📍 {currentUser.city} · 从业{currentUser.yearsExperience}年 · ⭐{currentUser.creditScore}分
            </Text>
            <View className={styles.anonymityTag}>
              <Text>🔒</Text>
              <Text>
                {currentUser.anonymity === 'public' ? '完全公开' :
                 currentUser.anonymity === 'semi-anonymous' ? '半匿名展示' : '完全匿名'}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>累计服务</Text>
            <Text className={styles.infoValue}>500+ 单</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>好评率</Text>
            <Text className={styles.infoValue}>98%</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>接单状态</Text>
            <Text className={styles.infoValue} style={{ color: currentUser.acceptOrder ? '#86B049' : '#8F8A82' }}>
              {currentUser.acceptOrder ? '● 可接单' : '○ 暂停接单'}
            </Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>注册时间</Text>
            <Text className={styles.infoValue}>2021.03</Text>
          </View>
        </View>
      </View>

      <View className={styles.card}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>
            <Text>🛤</Text>
            <Text>入行路径</Text>
          </Text>
          <Text className={styles.editBtn} onClick={() => handleEdit('career')}>编辑</Text>
        </View>
        {careerPath.map((item, idx) => (
          <View key={idx} className={styles.timelineItem}>
            <View className={styles.timelineDot}>
              <Text>{idx + 1}</Text>
            </View>
            <View className={styles.timelineContent}>
              <Text className={styles.timelinePeriod}>{item.period}</Text>
              <Text className={styles.timelineTitle}>{item.title}</Text>
              <Text className={styles.timelineDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
        <View className={styles.addTimelineBtn} onClick={() => handleEdit('career-add')}>
          <Text>+ 添加新经历</Text>
        </View>
      </View>

      <View className={styles.card}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>
            <Text>💪</Text>
            <Text>专业技能</Text>
          </Text>
          <Text className={styles.editBtn} onClick={() => handleEdit('skills')}>编辑</Text>
        </View>
        <View className={styles.skillsContainer}>
          {currentUser.skills.map((skill, idx) => (
            <View key={idx} className={styles.skillCard}>
              <Text className={styles.skillIcon}>✨</Text>
              <Text className={styles.skillName}>{skill}</Text>
              <Text className={styles.skillLevel}>熟练</Text>
            </View>
          ))}
          <View className={styles.addSkillBtn} onClick={() => handleEdit('skills-add')}>
            <Text>+ 添加技能</Text>
          </View>
        </View>
      </View>

      <View className={styles.card}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>
            <Text>🧰</Text>
            <Text>常用工具</Text>
          </Text>
          <Text className={styles.editBtn} onClick={() => handleEdit('tools')}>编辑</Text>
        </View>
        {tools.map((tool, idx) => (
          <View key={idx} className={styles.toolItem}>
            <View className={styles.toolInfo}>
              <View className={styles.toolIcon}>
                <Text>{tool.icon}</Text>
              </View>
              <View className={styles.toolDetail}>
                <Text className={styles.toolName}>{tool.name}</Text>
                <Text className={styles.toolBrand}>{tool.brand}</Text>
              </View>
            </View>
            <View className={styles.toolUsage}>
              <Text>{tool.usage}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.card}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>
            <Text>💰</Text>
            <Text>收费区间</Text>
          </Text>
          <Text className={styles.editBtn} onClick={() => handleEdit('fee')}>编辑</Text>
        </View>
        {currentUser.feeRange && (
          <View className={styles.feeCard}>
            <View className={styles.feeInfo}>
              <Text className={styles.feeLabel}>整体收费范围</Text>
              <Text className={styles.feeValue}>
                ¥{currentUser.feeRange.min.toLocaleString()} - ¥{currentUser.feeRange.max.toLocaleString()}
                <Text className={styles.feeUnit}> /{currentUser.feeRange.unit.replace('元/', '')}</Text>
              </Text>
            </View>
          </View>
        )}
        <View className={styles.serviceList}>
          {services.map((s, idx) => (
            <View key={idx} className={styles.serviceItem}>
              <Text className={styles.serviceName}>{s.name}</Text>
              <Text className={styles.serviceFee}>{s.fee}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
