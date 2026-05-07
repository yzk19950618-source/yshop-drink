# 仓库根目录 Dockerfile — 微信云托管 / CI 从 Git 根路径拉取构建时使用
# 构建 Spring Boot 后端（yshop-drink-boot3），与 yshop-server 模块一致，默认端口 48080
#
# 云托管「构建目录」若可选，请保持仓库根；端口与健康检查请与 application 中 server.port 一致

FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY yshop-drink-boot3 /build
RUN mvn -f /build/pom.xml clean package -pl yshop-server -am -DskipTests

FROM eclipse-temurin:17-jre-jammy
RUN mkdir -p /yshop-server
WORKDIR /yshop-server
COPY --from=builder /build/yshop-server/target/yshop-server.jar app.jar

ENV TZ=Asia/Shanghai
ENV JAVA_OPTS="-Xms512m -Xmx512m -Djava.security.egd=file:/dev/./urandom"
ENV ARGS=""

EXPOSE 48080

CMD java ${JAVA_OPTS} -jar app.jar $ARGS
