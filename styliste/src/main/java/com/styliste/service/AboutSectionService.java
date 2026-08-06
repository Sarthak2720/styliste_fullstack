package com.styliste.service;

import com.styliste.entity.AboutSection;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.AboutSectionRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AboutSectionService {

    private static final Logger log = LoggerFactory.getLogger(AboutSectionService.class);

    @Autowired
    private AboutSectionRepository aboutSectionRepository;

    @PostConstruct
    public void init() {
        if (aboutSectionRepository.count() == 0) {
            log.info("No about us sections found. Seeding default sections...");
            seedDefaultSections();
        } else {
            ensureConsecutiveGroups();
        }
    }

    private void ensureConsecutiveGroups() {
        try {
            List<AboutSection> all = aboutSectionRepository.findAllByOrderBySortOrderAsc();
            List<AboutSection> sorted = new ArrayList<>();
            
            List<AboutSection> heroes = all.stream().filter(s -> "HERO".equals(s.getLayoutType())).toList();
            List<AboutSection> visions = all.stream().filter(s -> "VISION_GOAL".equals(s.getLayoutType())).toList();
            List<AboutSection> storyRight = all.stream().filter(s -> "STORY_IMAGE_RIGHT".equals(s.getLayoutType())).toList();
            List<AboutSection> team = all.stream().filter(s -> "TEAM_MEMBER".equals(s.getLayoutType())).toList();
            List<AboutSection> services = all.stream().filter(s -> "SERVICE_CARD".equals(s.getLayoutType())).toList();
            List<AboutSection> storyLeft = all.stream().filter(s -> "STORY_IMAGE_LEFT".equals(s.getLayoutType())).toList();
            List<AboutSection> ctas = all.stream().filter(s -> "CTA".equals(s.getLayoutType())).toList();
            List<AboutSection> others = all.stream().filter(s -> 
                !List.of("HERO", "VISION_GOAL", "STORY_IMAGE_RIGHT", "TEAM_MEMBER", "SERVICE_CARD", "STORY_IMAGE_LEFT", "CTA")
                .contains(s.getLayoutType())
            ).toList();
            
            sorted.addAll(heroes);
            sorted.addAll(visions);
            sorted.addAll(storyRight);
            sorted.addAll(team);
            sorted.addAll(services);
            sorted.addAll(storyLeft);
            sorted.addAll(ctas);
            sorted.addAll(others);
            
            for (int i = 0; i < sorted.size(); i++) {
                AboutSection s = sorted.get(i);
                if (s.getSortOrder() != i + 1) {
                    s.setSortOrder(i + 1);
                    aboutSectionRepository.save(s);
                }
            }
            log.info("Successfully verified and aligned About Us sections consecutively.");
        } catch (Exception e) {
            log.error("Failed to align consecutive groups on startup", e);
        }
    }

    public List<AboutSection> getAllSections() {
        return aboutSectionRepository.findAllByOrderBySortOrderAsc();
    }

    public AboutSection getSectionById(Long id) {
        return aboutSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("About section not found with id: " + id));
    }

    public AboutSection createSection(AboutSection section) {
        List<AboutSection> sameTypeSections = aboutSectionRepository.findAll().stream()
                .filter(s -> s.getLayoutType().equals(section.getLayoutType()))
                .sorted((a, b) -> Integer.compare(a.getSortOrder(), b.getSortOrder()))
                .toList();

        int targetOrder;
        if (!sameTypeSections.isEmpty()) {
            AboutSection lastOne = sameTypeSections.get(sameTypeSections.size() - 1);
            targetOrder = lastOne.getSortOrder() + 1;
            
            List<AboutSection> allSections = aboutSectionRepository.findAll();
            for (AboutSection s : allSections) {
                if (s.getSortOrder() >= targetOrder) {
                    s.setSortOrder(s.getSortOrder() + 1);
                    aboutSectionRepository.save(s);
                }
            }
        } else {
            int maxOrder = aboutSectionRepository.findAll().stream()
                    .mapToInt(AboutSection::getSortOrder)
                    .max()
                    .orElse(0);
            targetOrder = maxOrder + 1;
        }

        section.setSortOrder(targetOrder);
        return aboutSectionRepository.save(section);
    }

    public AboutSection updateSection(Long id, AboutSection sectionDetails) {
        AboutSection section = getSectionById(id);
        
        section.setTitle(sectionDetails.getTitle());
        section.setSubtitle(sectionDetails.getSubtitle());
        section.setContent(sectionDetails.getContent());
        section.setImageUrl(sectionDetails.getImageUrl());
        section.setIcon(sectionDetails.getIcon());
        section.setLayoutType(sectionDetails.getLayoutType());
        if (sectionDetails.getSortOrder() != null) {
            section.setSortOrder(sectionDetails.getSortOrder());
        }

        return aboutSectionRepository.save(section);
    }

    public void deleteSection(Long id) {
        AboutSection section = getSectionById(id);
        aboutSectionRepository.delete(section);
    }

    public void reorderSections(List<Long> sectionIds) {
        for (int i = 0; i < sectionIds.size(); i++) {
            Long id = sectionIds.get(i);
            AboutSection section = aboutSectionRepository.findById(id).orElse(null);
            if (section != null) {
                section.setSortOrder(i + 1);
                aboutSectionRepository.save(section);
            }
        }
    }

    private void seedDefaultSections() {
        List<AboutSection> defaults = new ArrayList<>();

        // 1. HERO Section
        defaults.add(AboutSection.builder()
                .title("Revolutionising")
                .subtitle("Women's Fashion")
                .content("An innovative ladies' garments brand that aims to revolutionise the way women shop for clothing in India.")
                .imageUrl("/assets/hero-about.jpg")
                .layoutType("HERO")
                .sortOrder(1)
                .build());

        // 2. VISION Section
        defaults.add(AboutSection.builder()
                .title("Empowering Every Woman")
                .subtitle("Our Vision")
                .content("Our expert team is dedicated to helping every woman, regardless of age, feel confident in fashionable clothing thoughtfully designed to compliment her unique body type.")
                .icon("Eye")
                .layoutType("VISION_GOAL")
                .sortOrder(2)
                .build());

        // 3. GOALS Section
        defaults.add(AboutSection.builder()
                .title("Expanding Horizons")
                .subtitle("Our Goals")
                .content("To establish 4–5 boutiques within the next 2–3 years across Thane, Mumbai, and Pune.")
                .icon("Target")
                .layoutType("VISION_GOAL")
                .sortOrder(3)
                .build());

        // 4. STORY Section
        defaults.add(AboutSection.builder()
                .title("Seamless Fashion Experience")
                .subtitle("Our Story")
                .content("We provide customers with a seamless online shopping experience, offering a wide range of fashionable and affordable clothing items. Our unique selling proposition is our \"Try Before You Buy Online\" service, which allows customers to try their selected garments online using our AI Tool.<br/><br/>Additionally, we offer on-demand doorstep tailoring services in Thane & Mulund area, enabling customers to create custom designs, convert old sarees into designer wear, and request alterations, all from the comfort of their homes.")
                .imageUrl("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80")
                .layoutType("STORY_IMAGE_RIGHT")
                .sortOrder(4)
                .build());

        // 5. TEAM Member 1
        defaults.add(AboutSection.builder()
                .title("Babita Dahal")
                .subtitle("Senior Fashion Designer")
                .content("She has more than 25 years of experience in the fashion and lifestyle industry. She is also a professional Makeup Artist. Worked with multiple Indian brands and invited as faculty in various Fashion Institutes.")
                .imageUrl("https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80")
                .layoutType("TEAM_MEMBER")
                .sortOrder(5)
                .build());

        // 6. TEAM Member 2
        defaults.add(AboutSection.builder()
                .title("Istyak Ahemad")
                .subtitle("Cutting Master and Tailor")
                .content("He has more than 20 years of experience in the ladies' garment industry—a very talented and down-to-earth individual.")
                .imageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80")
                .layoutType("TEAM_MEMBER")
                .sortOrder(6)
                .build());

        // 7. TEAM Member 3
        defaults.add(AboutSection.builder()
                .title("Yaseen Shaikh")
                .subtitle("Tailor")
                .content("Has vast experience in stitching all types of Ladies' Garments.")
                .imageUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80")
                .layoutType("TEAM_MEMBER")
                .sortOrder(7)
                .build());

        // 8. TEAM Member 4
        defaults.add(AboutSection.builder()
                .title("Pooja Kumari")
                .subtitle("Helping Hand of Babita Ma'am")
                .content("She is a great help in completing small tasks like hand stitching, fall piko, thread work, hand embroidery, and helping Babita ma'am in her work.")
                .imageUrl("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80")
                .layoutType("TEAM_MEMBER")
                .sortOrder(8)
                .build());

        // 9. SERVICE 1
        defaults.add(AboutSection.builder()
                .title("Expert Designers")
                .subtitle("")
                .content("Our team of expert designers will guide you through the entire design process with the latest style guide.")
                .icon("Scissors")
                .layoutType("SERVICE_CARD")
                .sortOrder(9)
                .build());

        // 10. SERVICE 2
        defaults.add(AboutSection.builder()
                .title("Doorstep Service")
                .subtitle("")
                .content("Our tailor will visit your home to confirm measurements and offer a free pick-up facility for fabric and samples.")
                .icon("Home")
                .layoutType("SERVICE_CARD")
                .sortOrder(10)
                .build());

        // 11. SERVICE 3
        defaults.add(AboutSection.builder()
                .title("All Garment Types")
                .subtitle("")
                .content("From classic patterns and Bollywood-inspired designs to the latest fashion trends - we stitch all types of garments.")
                .icon("Shirt")
                .layoutType("SERVICE_CARD")
                .sortOrder(11)
                .build());

        // 12. SERVICE 4
        defaults.add(AboutSection.builder()
                .title("Perfect Finish")
                .subtitle("")
                .content("We stitch your garment to perfection - both in quality and finish, delivered hassle-free to your address.")
                .icon("Sparkles")
                .layoutType("SERVICE_CARD")
                .sortOrder(12)
                .build());

        // 13. PROMISE Section
        defaults.add(AboutSection.builder()
                .title("Hassle-Free Fashion")
                .subtitle("Our Promise")
                .content("Thanks to our online/doorstep tailoring service, you don't have to worry about finding the right tailor or finding a designer who understands your fashion needs. Our team of expert designers, tailors, and customer representatives will be your trusted partner in achieving a world-class, fashionable, customized wardrobe.<br/><br/>Our website is easy to use, with a detailed guide that helps you choose the dress length, neckline, sleeves, hemline, openings, and other specifics of your preference. When you place an order with us, our tailor will visit your home to confirm all measurements and offer a free pick-up facility to collect the fabric and sample from you.")
                .imageUrl("https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80")
                .layoutType("STORY_IMAGE_LEFT")
                .sortOrder(13)
                .build());

        // 14. CTA Section
        defaults.add(AboutSection.builder()
                .title("Experience Styliste Couturier")
                .subtitle("")
                .content("Visit our boutique or book a doorstep consultation with one of our expert designers.")
                .layoutType("CTA")
                .sortOrder(14)
                .build());

        aboutSectionRepository.saveAll(defaults);
        log.info("Default sections seeded successfully.");
    }
}
