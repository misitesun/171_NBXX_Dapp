# ADR 0005: Private page images and reusable common assets
# ADR 0005：页面私有图片与公共资源归档

- Status: Accepted
- Date: 2026-09-23

## Context / 背景

Page-specific exports and reusable icons need separate locations so identical images are not copied into several pages.
页面专属切图与可复用图标需要分别归档，避免在多个页面重复保存相同图片。

## Decision / 决策

Put private page images in a dedicated directory under `src/assets/`; put public, reusable images and icons once under `src/assets/common/` with semantic names. Pages import the shared file. Keep project branding under `public/brand/`.
页面私有图片存放在 `src/assets/` 下的页面专属目录；公共类型、可复用的图片和图标以语义化名称只存放一份于 `src/assets/common/`，各页面共同引用。项目品牌资源继续放在 `public/brand/`。

## Consequences / 后果

Check existing common assets before exporting a new image. Reuse only an actual match; similar but different artwork remains separate. This rule does not move existing files by itself.
新增图片前先检查现有公共资源；只有确认为同一素材才复用，外观相近但不同的切图仍分开保存。本规则本身不迁移现有文件。
